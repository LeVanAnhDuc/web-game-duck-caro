import type { Level, Move, Point, Side } from '@/game/core/types';
import type { GameRepository } from './GameRepository';
import { ALL_VERSIONS_PREFIX, currentGameKey, statsKey } from './keys';
import { createSafeStorage, type SafeStorage } from './safeStorage';
import {
  EMPTY_LEVEL_STATS,
  EMPTY_STATS,
  type GameResult,
  type LevelStats,
  type SavedGame,
  type StatsByLevel,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSide = (value: unknown): value is Side => value === 'human' || value === 'ai';

const isLevel = (value: unknown): value is Level =>
  value === 'easy' || value === 'normal' || value === 'hard';

const isPoint = (value: unknown): value is Point =>
  isRecord(value) && Number.isInteger(value.x) && Number.isInteger(value.y);

const isMove = (value: unknown): value is Move =>
  isRecord(value) && isPoint(value.at) && isSide(value.side);

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

function parseJson(text: string | null): unknown {
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Kiểm HÌNH DẠNG, không kiểm tính hợp lệ của ván.
 *
 * Một danh sách nước đi đúng kiểu vẫn có thể là ván không hợp lệ — hai nước cùng ô,
 * hoặc hai nước liền của cùng một bên. Việc đó do `core/game.replay` phát hiện, và
 * tầng `hooks` bắt: `game/storage` không được biết luật chơi (ranh giới module ở
 * `architecture.md` §3). Ở đây chỉ đảm bảo dữ liệu đọc ra không làm vỡ TypeScript.
 *
 * Dựng lại từng object thay vì trả nguyên thứ `JSON.parse` cho ra, để một khoá lạ ai
 * đó thêm vào bằng tay không đi tiếp vào trong ứng dụng.
 */
function parseSavedGame(value: unknown): SavedGame | null {
  if (!isRecord(value)) return null;
  const { moves, first, level, savedAt } = value;
  if (!Array.isArray(moves) || !moves.every(isMove)) return null;
  if (!isSide(first) || !isLevel(level) || typeof savedAt !== 'string') return null;
  return {
    moves: moves.map((move) => ({ at: { x: move.at.x, y: move.at.y }, side: move.side })),
    first,
    level,
    savedAt,
  };
}

function parseLevelStats(value: unknown): LevelStats {
  if (!isRecord(value)) return EMPTY_LEVEL_STATS;
  const { wins, losses, resigns } = value;
  return {
    wins: isCount(wins) ? wins : 0,
    losses: isCount(losses) ? losses : 0,
    resigns: isCount(resigns) ? resigns : 0,
  };
}

/** Một mức hỏng chỉ mất mức đó, không mất cả bảng. */
function parseStats(value: unknown): StatsByLevel {
  if (!isRecord(value)) return EMPTY_STATS;
  return {
    easy: parseLevelStats(value.easy),
    normal: parseLevelStats(value.normal),
    hard: parseLevelStats(value.hard),
  };
}

const RESULT_FIELD: Readonly<Record<GameResult, keyof LevelStats>> = {
  win: 'wins',
  loss: 'losses',
  resign: 'resigns',
};

/**
 * `GameRepository` trên `localStorage`.
 *
 * Không có nhánh `catch` nào ở đây: `safeStorage` đã hứa không ném, và mọi dữ liệu
 * đọc ra đi qua một hàm kiểm hình dạng trả về giá trị mặc định. Ghi không được thì
 * **im lặng bỏ qua** — người chơi mất tính năng nhớ ván, không mất ván đang chơi.
 */
export function createLocalGameRepository(
  storage: SafeStorage = createSafeStorage(),
  owner?: string,
): GameRepository {
  const gameKey = currentGameKey(owner);
  const key = statsKey(owner);

  return {
    async loadCurrentGame(): Promise<SavedGame | null> {
      return parseSavedGame(parseJson(storage.read(gameKey)));
    },

    async saveCurrentGame(game: SavedGame): Promise<void> {
      storage.write(gameKey, JSON.stringify(game));
    },

    async clearCurrentGame(): Promise<void> {
      storage.remove(gameKey);
    },

    async loadStats(): Promise<StatsByLevel> {
      return parseStats(parseJson(storage.read(key)));
    },

    async recordResult(level: Level, result: GameResult): Promise<void> {
      const current = parseStats(parseJson(storage.read(key)));
      const field = RESULT_FIELD[result];
      const next: StatsByLevel = {
        ...current,
        [level]: { ...current[level], [field]: current[level][field] + 1 },
      };
      storage.write(key, JSON.stringify(next));
    },

    async clearAll(): Promise<void> {
      // Xoá theo tiền tố CHUNG của mọi version, nên rác của version cũ cũng đi.
      for (const found of storage.keysWithPrefix(ALL_VERSIONS_PREFIX)) storage.remove(found);
    },
  };
}
