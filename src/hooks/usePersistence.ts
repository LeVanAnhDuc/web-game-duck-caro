'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState, Level, Side } from '@/game/core/types';
import type { GameRepository } from '@/game/storage/GameRepository';
import { EMPTY_STATS, type GameResult, type SavedGame, type StatsByLevel } from '@/game/storage/types';

export type UsePersistence = {
  /** `undefined` = chưa đọc xong. `null` = đọc xong và không có ván nào. */
  readonly restored: SavedGame | null | undefined;
  readonly stats: StatsByLevel;
  save(state: GameState, first: Side, level: Level): void;
  clearGame(): void;
  record(level: Level, result: GameResult): void;
  clearAll(): void;
};

/**
 * Cầu nối React ↔ `GameRepository`.
 *
 * UI **không bao giờ** gọi `localStorage` trực tiếp (bất biến 5) — mọi truy cập đi
 * qua đây, và đây đi qua repository. Nhờ vậy ngày đổi sang bản remote là một dòng ở
 * chỗ khởi tạo (ADR-0006).
 */
export function usePersistence(repository: GameRepository): UsePersistence {
  const [restored, setRestored] = useState<SavedGame | null | undefined>(undefined);
  const [stats, setStats] = useState<StatsByLevel>(EMPTY_STATS);

  // Repository là async, và mọi lời gọi ghi đều là "gửi rồi quên". Nếu component đã
  // rời đi mà một Promise mới xong, `setState` sau đó là ghi vào một cây đã tháo.
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [game, loadedStats] = await Promise.all([
        repository.loadCurrentGame(),
        repository.loadStats(),
      ]);
      if (cancelled || !alive.current) return;
      setRestored(game);
      setStats(loadedStats);
    })();
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const save = useCallback(
    (state: GameState, first: Side, level: Level) => {
      // Ván chưa có nước nào, hoặc đã kết thúc, thì không có gì để tiếp tục.
      if (state.moves.length === 0 || state.status.kind !== 'playing') {
        void repository.clearCurrentGame();
        return;
      }
      void repository.saveCurrentGame({
        moves: state.moves,
        first,
        level,
        // UTC (NFR-I18N-02). Đổi múi giờ chỉ xảy ra ở tầng hiển thị.
        savedAt: new Date().toISOString(),
      });
    },
    [repository],
  );

  const clearGame = useCallback(() => {
    void repository.clearCurrentGame();
  }, [repository]);

  const record = useCallback(
    (level: Level, result: GameResult) => {
      void (async () => {
        await repository.recordResult(level, result);
        const next = await repository.loadStats();
        if (alive.current) setStats(next);
      })();
    },
    [repository],
  );

  const clearAll = useCallback(() => {
    void (async () => {
      await repository.clearAll();
      if (!alive.current) return;
      setStats(EMPTY_STATS);
      setRestored(null);
    })();
  }, [repository]);

  return { restored, stats, save, clearGame, record, clearAll };
}
