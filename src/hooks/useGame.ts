'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Engine } from '@/game/ai/Engine';
import { applyMove, createGame, replay, resign, undo } from '@/game/core/game';
import type { GameState, Level, Mode, Point, Rule, Side } from '@/game/core/types';
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
  /** Ai ngồi ghế nào. Views đọc nó để gọi tên ghế; KHÔNG suy từ tên ghế (bất biến 15). */
  readonly mode: Mode;
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
  restart(opts: { first: Side; level: Level; mode: Mode; rule: Rule }): void;
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

export function useGame(
  engine: Engine,
  opts: { first: Side; level: Level; mode: Mode; rule: Rule },
): UseGame {
  const [first, setFirst] = useState<Side>(opts.first);
  const [level, setLevel] = useState<Level>(opts.level);
  const [mode, setMode] = useState<Mode>(opts.mode);
  const [state, setState] = useState<GameState>(() =>
    createGame(opts.first, opts.rule),
  );
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
  const modeRef = useRef(mode);
  modeRef.current = mode;

  /**
   * Ghế đang đi có phải người thật không — bất biến 15.
   *
   * Đây là chỗ DUY NHẤT được phép trả lời "tới lượt người hay tới lượt máy". Suy
   * ra từ `side === 'two'` thì hot-seat sẽ gọi engine cho người thứ hai, và điều đó
   * đúng về kiểu nên không test nào đỏ.
   */
  const isHumanTurn = useCallback(
    (from: GameState): boolean =>
      from.status.kind === 'playing' && modeRef.current[from.toMove] === 'human',
    [],
  );

  const askEngine = useCallback(
    (from: GameState) => {
      const id = requestId.current + 1;
      requestId.current = id;
      setThinking(true);

      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('engine timeout')), ENGINE_TIMEOUT_MS);
      });

      Promise.race([
        engine.bestMove(from.moves, from.toMove, levelRef.current, from.rule),
        timeout,
      ])
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
      /*
       * Ghế đang đi phải do NGƯỜI cầm. Ở chế độ đấu máy, ngay sau nước của người thì
       * `toMove` đã là ghế của máy, nên đây cũng là lớp chặn double-tap phía UI của
       * NFR-REL-02. Ở hot-seat thì cả hai ghế đều qua được — đúng như phải vậy.
       */
      if (!isHumanTurn(current)) return;
      const seat = current.toMove;

      const result = applyMove(current, at, seat);
      if (!result.ok) {
        if (result.reason === 'occupied') setNotice(strings.cellOccupied);
        return;
      }

      setState(result.state);
      setHint(null);
      const who = strings.seatName(seat, modeRef.current);
      if (result.state.status.kind === 'won') {
        setNotice(strings.seatWonAt(who, at.x, at.y));
        return;
      }
      setNotice(strings.seatMovedAt(who, at.x, at.y));
      // Chỉ gọi engine khi ghế KẾ TIẾP do engine cầm. Hot-seat không bao giờ vào đây.
      if (modeRef.current[result.state.toMove] === 'engine') askEngine(result.state);
    },
    [askEngine, isHumanTurn],
  );

  const undoMove = useCallback(() => {
    requestId.current += 1; // vô hiệu hoá mọi kết quả engine đang bay
    setThinking(false);
    setHinting(false);
    setHint(null);
    setNotice(null);
    setState((current) => undo(current, first, modeRef.current));
  }, [first]);

  const giveUp = useCallback(() => {
    requestId.current += 1;
    setThinking(false);
    setHinting(false);
    setHint(null);
    setState((current) => {
      // Ghế ĐANG ĐI nhận thua. Cố định 'one' là bắt người kia thua thay ở hot-seat.
      setNotice(strings.seatResigned(strings.seatName(current.toMove, modeRef.current)));
      return resign(current, current.toMove);
    });
  }, []);

  const restart = useCallback(
    (next: { first: Side; level: Level; mode: Mode; rule: Rule }) => {
      requestId.current += 1;
      setThinking(false);
      setHinting(false);
      setHint(null);
      setReviewAt(null);
      setNotice(null);
      setFirst(next.first);
      setLevel(next.level);
      levelRef.current = next.level;
      setMode(next.mode);
      modeRef.current = next.mode;
      const fresh = createGame(next.first, next.rule);
      setState(fresh);
      if (next.mode[next.first] === 'engine') askEngine(fresh);
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
    setState(createGame(first, stateRef.current.rule));
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
    if (!isHumanTurn(current)) return;

    const id = requestId.current + 1;
    requestId.current = id;
    setHinting(true);
    setHint(null);
    setNotice(strings.hintThinking);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('hint timeout')), ENGINE_TIMEOUT_MS);
    });

    Promise.race([
      engine.bestMove(current.moves, current.toMove, HINT_LEVEL, current.rule),
      timeout,
    ])
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
  }, [engine, isHumanTurn]);

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
        restored = replay(saved.moves, saved.first, saved.rule);
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
      setMode(saved.mode);
      modeRef.current = saved.mode;
      setState(restored);
      /*
       * Rời đi đúng lúc máy đang nghĩ thì nước đó chưa được lưu — vào lại, máy nghĩ
       * lại. Điều kiện phải hỏi `saved.mode`, không hỏi tên ghế: một ván hot-seat lưu
       * giữa lượt Người 2 sẽ bị engine đánh hộ nếu ở đây viết `toMove === 'two'`.
       */
      if (
        restored.status.kind === 'playing' &&
        saved.mode[restored.toMove] === 'engine'
      ) {
        askEngine(restored);
      }
      return true;
    },
    [askEngine],
  );

  // Máy đi trước ngay từ lúc khởi tạo thì nó phải tự đánh. Chạy đúng một lần.
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (opts.mode[opts.first] === 'engine') {
      askEngine(createGame(opts.first, opts.rule));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    mode,
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
