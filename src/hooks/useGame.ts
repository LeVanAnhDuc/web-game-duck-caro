'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Engine } from '@/game/ai/Engine';
import { applyMove, createGame, replay, resign, undo } from '@/game/core/game';
import type { GameState, Level, Point, Side } from '@/game/core/types';
import type { SavedGame } from '@/game/storage/types';
import { strings } from '@/lib/strings';

/** Hết hạn thì ván vẫn đi tiếp, không treo ở "máy đang nghĩ" (NFR-REL-01 · NFR-REL-03). */
export const ENGINE_TIMEOUT_MS = 5000;

/**
 * Gợi ý LUÔN hỏi mức Khó, bất kể ván đang ở mức nào — ADR-0016.
 *
 * Ở mức Dễ engine cố ý mù (ADR-0005 · ADR-0015), nên "nước engine chọn" ở đó không
 * phải "nước tốt". Một gợi ý dở tệ hơn không có gợi ý: người chơi tin nó, đánh theo,
 * rồi thua vì nó.
 */
const HINT_LEVEL: Level = 'hard';

export type UseGame = {
  readonly state: GameState;
  readonly thinking: boolean;
  readonly notice: string | null;
  /** Ô engine đề xuất, hoặc `null`. Người gọi đẩy nó vào quân xem trước của bàn. */
  readonly hint: Point | null;
  readonly hinting: boolean;
  /** `null` = không xem lại. Số = đang đứng ở nước thứ n (0 = bàn trống). */
  readonly reviewAt: number | null;
  place(at: Point): void;
  undoMove(): void;
  giveUp(): void;
  restart(opts: { first: Side; level: Level }): void;
  askHint(): void;
  /** Chỉ vào được khi ván ĐÃ kết thúc — xem lại là chỉ đọc (US-03). */
  enterReview(): void;
  exitReview(): void;
  /** Tự kẹp vào [0, moves.length]. */
  gotoMove(n: number): void;
  /** Về ván trống, KHÔNG cho máy đi trước — dùng khi quay lại màn chọn mức. */
  resetToMenu(): void;
  /** `false` nghĩa là ván lưu không dựng lại được; người gọi nên xoá nó đi. */
  resume(saved: SavedGame): boolean;
};

export function useGame(engine: Engine, opts: { first: Side; level: Level }): UseGame {
  const [first, setFirst] = useState<Side>(opts.first);
  const [level, setLevel] = useState<Level>(opts.level);
  const [state, setState] = useState<GameState>(() => createGame(opts.first));
  const [thinking, setThinking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [hint, setHint] = useState<Point | null>(null);
  const [hinting, setHinting] = useState(false);
  /*
   * Xem lại là một PHÉP CHIẾU trên `moves`, không phải một ván thứ hai (design.md §2).
   * Cả chế độ xem lại chỉ tốn đúng con số này; bàn hiển thị là `moves.slice(0, n)`.
   * Nếu ở đây có thêm một `GameState` nữa thì bất biến 1 đã bị phá.
   */
  const [reviewAt, setReviewAt] = useState<number | null>(null);

  /** Bất biến 7: mọi kết quả engine phải khớp id hiện tại, không khớp thì BỎ. */
  const requestId = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;
  const levelRef = useRef(level);
  levelRef.current = level;

  const askEngine = useCallback(
    (from: GameState) => {
      const id = requestId.current + 1;
      requestId.current = id;
      setThinking(true);

      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('engine timeout')), ENGINE_TIMEOUT_MS);
      });

      Promise.race([engine.bestMove(from.moves, from.toMove, levelRef.current), timeout])
        .then((at) => {
          if (requestId.current !== id) return;
          setState((current) => {
            const result = applyMove(current, at, current.toMove);
            if (!result.ok) return current;
            setNotice(
              result.state.status.kind === 'won'
                ? strings.youLose
                : strings.aiPlacedAt(at.x, at.y),
            );
            return result.state;
          });
        })
        .catch(() => {
          if (requestId.current !== id) return;
          setNotice(strings.aiGaveUpThinking);
        })
        .finally(() => {
          if (timer !== undefined) clearTimeout(timer);
          if (requestId.current === id) setThinking(false);
        });
    },
    [engine],
  );

  const place = useCallback(
    (at: Point) => {
      const current = stateRef.current;
      // Chưa tới lượt thì bỏ qua. Sau nước của người chơi, `toMove` là 'ai' ngay lập
      // tức, nên đây cũng là lớp chặn double-tap phía UI của NFR-REL-02.
      if (current.toMove !== 'human' || current.status.kind !== 'playing') return;

      const result = applyMove(current, at, 'human');
      if (!result.ok) {
        if (result.reason === 'occupied') setNotice(strings.cellOccupied);
        return;
      }

      setState(result.state);
      setHint(null);
      if (result.state.status.kind === 'won') {
        setNotice(strings.wonAt(at.x, at.y));
        return;
      }
      setNotice(strings.placedAt(at.x, at.y));
      askEngine(result.state);
    },
    [askEngine],
  );

  const undoMove = useCallback(() => {
    requestId.current += 1; // vô hiệu hoá mọi kết quả engine đang bay
    setThinking(false);
    setHinting(false);
    setHint(null);
    setNotice(null);
    setState((current) => undo(current, first));
  }, [first]);

  const giveUp = useCallback(() => {
    requestId.current += 1;
    setThinking(false);
    setHinting(false);
    setHint(null);
    setNotice(strings.youResigned);
    setState((current) => resign(current, 'human'));
  }, []);

  const restart = useCallback(
    (next: { first: Side; level: Level }) => {
      requestId.current += 1;
      setThinking(false);
      setHinting(false);
      setHint(null);
      setReviewAt(null);
      setNotice(null);
      setFirst(next.first);
      setLevel(next.level);
      levelRef.current = next.level;
      const fresh = createGame(next.first);
      setState(fresh);
      if (next.first === 'ai') askEngine(fresh);
    },
    [askEngine],
  );

  /**
   * Về ván trống mà KHÔNG khởi động máy.
   *
   * Khác `restart`: `restart` bắt đầu một ván mới và có thể cho máy đi ngay, còn hàm
   * này chỉ dọn — dùng khi người chơi quay lại màn chọn mức và chưa chọn gì.
   */
  const resetToMenu = useCallback(() => {
    requestId.current += 1;
    setThinking(false);
    setHinting(false);
    setHint(null);
    setReviewAt(null);
    setNotice(null);
    setState(createGame(first));
  }, [first]);

  /**
   * Xin một nước gợi ý. Không thêm nước nào vào ván — nó chỉ trả ra một điểm để
   * người gọi đẩy vào quân xem trước.
   *
   * Dùng CHUNG `requestId` với nước của máy (bất biến 7): hoàn nước hay bắt đầu ván
   * mới trong lúc gợi ý đang bay sẽ làm kết quả đó bị bỏ. Không có nó, một gợi ý xin
   * từ thế bàn cũ sẽ hiện lên trên thế bàn mới — vẫn là một ô, chỉ là ô sai.
   */
  const askHint = useCallback(() => {
    const current = stateRef.current;
    if (current.toMove !== 'human' || current.status.kind !== 'playing') return;

    const id = requestId.current + 1;
    requestId.current = id;
    setHinting(true);
    setHint(null);
    setNotice(strings.hintThinking);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('hint timeout')), ENGINE_TIMEOUT_MS);
    });

    Promise.race([engine.bestMove(current.moves, 'human', HINT_LEVEL), timeout])
      .then((at) => {
        if (requestId.current !== id) return;
        setHint(at);
        setNotice(strings.hintAt(at.x, at.y));
      })
      .catch(() => {
        if (requestId.current !== id) return;
        setNotice(strings.hintFailed);
      })
      .finally(() => {
        if (timer !== undefined) clearTimeout(timer);
        if (requestId.current === id) setHinting(false);
      });
  }, [engine]);

  const enterReview = useCallback(() => {
    const current = stateRef.current;
    // Ván đang dở không xem lại được: cho phép sẽ tạo ra "đang xem quá khứ trong khi
    // máy vẫn có thể trả nước", đúng chỗ sai âm thầm mà journeys.md §US-03 chỉ tên.
    if (current.status.kind === 'playing') return;
    setReviewAt(current.moves.length);
  }, []);

  const exitReview = useCallback(() => setReviewAt(null), []);

  const gotoMove = useCallback((n: number) => {
    setReviewAt((cur) =>
      cur === null ? cur : Math.max(0, Math.min(stateRef.current.moves.length, n)),
    );
  }, []);

  /**
   * Dựng lại một ván đã lưu.
   *
   * `replay` NÉM khi danh sách nước đi không hợp lệ — hai nước cùng ô, hai nước liền
   * của cùng một bên. `game/storage` cố ý không biết luật chơi (ranh giới module ở
   * `architecture.md` §3), nên chỗ bắt là đây. Trả `false` chứ không ném tiếp: một
   * ván lưu hỏng được phép làm người chơi MẤT ván đó, không được phép làm app vỡ
   * (NFR-REL-04).
   */
  const resume = useCallback(
    (saved: SavedGame): boolean => {
      let restored: GameState;
      try {
        restored = replay(saved.moves, saved.first);
      } catch {
        return false;
      }
      requestId.current += 1;
      setThinking(false);
      setHinting(false);
      setHint(null);
      setReviewAt(null);
      setNotice(null);
      setFirst(saved.first);
      setLevel(saved.level);
      levelRef.current = saved.level;
      setState(restored);
      // Rời đi đúng lúc máy đang nghĩ thì nước đó chưa được lưu — vào lại, máy nghĩ lại.
      if (restored.status.kind === 'playing' && restored.toMove === 'ai') askEngine(restored);
      return true;
    },
    [askEngine],
  );

  // Máy đi trước ngay từ lúc khởi tạo thì nó phải tự đánh. Chạy đúng một lần.
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (opts.first === 'ai') askEngine(createGame('ai'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    thinking,
    notice,
    hint,
    hinting,
    reviewAt,
    place,
    undoMove,
    giveUp,
    restart,
    resetToMenu,
    resume,
    askHint,
    enterReview,
    exitReview,
    gotoMove,
  };
}
