import type { Level, Move, Side } from '@/game/core/types';

/**
 * Ván đang chơi, đủ để dựng lại trạng thái.
 *
 * Lưu `moves` chứ không lưu bàn — `moves` là nguồn đúng (bất biến 1), và `core/game.replay`
 * dựng lại mọi thứ khác từ nó, kể cả lượt đi và trạng thái thắng.
 */
export type SavedGame = {
  readonly moves: readonly Move[];
  readonly first: Side;
  readonly level: Level;
  /** ISO 8601 ở **UTC** (NFR-I18N-02). Đổi múi giờ chỉ xảy ra ở tầng hiển thị. */
  readonly savedAt: string;
};

/** Không có `draw`: bàn vô hạn không bao giờ hết ô (ADR-0003). */
export type GameResult = 'win' | 'loss' | 'resign';

export type LevelStats = {
  readonly wins: number;
  readonly losses: number;
  readonly resigns: number;
};

export type StatsByLevel = Readonly<Record<Level, LevelStats>>;

export const EMPTY_LEVEL_STATS: LevelStats = { wins: 0, losses: 0, resigns: 0 };

export const EMPTY_STATS: StatsByLevel = {
  easy: EMPTY_LEVEL_STATS,
  normal: EMPTY_LEVEL_STATS,
  hard: EMPTY_LEVEL_STATS,
};

export const totalGames = (stats: LevelStats): number =>
  stats.wins + stats.losses + stats.resigns;
