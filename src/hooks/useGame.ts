'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Engine } from '@/game/ai/Engine';
import { applyMove, createGame, replay, resign, undo } from '@/game/core/game';
import type { GameState, Level, Point, Side } from '@/game/core/types';
import type { SavedGame } from '@/game/storage/types';
import { strings } from '@/lib/strings';

/** Hết hạn thì ván vẫn đi tiếp, không treo ở "máy đang nghĩ" (NFR-REL-01 · NFR-REL-03). */
export const ENGINE_TIMEOUT_MS = 5000;

export type UseGame = {
  readonly state: GameState;
  readonly thinking: boolean;
  readonly notice: string | null;
  place(at: Point): void;
  undoMove(): void;
  giveUp(): void;
  restart(opts: { first: Side; level: Level }): void;
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
    setNotice(null);
    setState((current) => undo(current, first));
  }, [first]);

  const giveUp = useCallback(() => {
    requestId.current += 1;
    setThinking(false);
    setNotice(strings.youResigned);
    setState((current) => resign(current, 'human'));
  }, []);

  const restart = useCallback(
    (next: { first: Side; level: Level }) => {
      requestId.current += 1;
      setThinking(false);
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
    setNotice(null);
    setState(createGame(first));
  }, [first]);

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

  return { state, thinking, notice, place, undoMove, giveUp, restart, resetToMenu, resume };
}
