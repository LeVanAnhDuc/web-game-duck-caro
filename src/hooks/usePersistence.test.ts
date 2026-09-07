import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { createGame, applyMove } from '@/game/core/game';
import type { GameState, Level, Move, Point, Side } from '@/game/core/types';
import type { GameRepository } from '@/game/storage/GameRepository';
import { EMPTY_STATS, type GameResult, type SavedGame, type StatsByLevel } from '@/game/storage/types';
import { usePersistence, type UsePersistence } from './usePersistence';

/** Repository trong bộ nhớ, ghi lại từng lời gọi để khẳng định số lần. */
function fakeRepository(seed?: { game?: SavedGame; stats?: StatsByLevel }) {
  const calls: string[] = [];
  let game: SavedGame | null = seed?.game ?? null;
  let stats: StatsByLevel = seed?.stats ?? EMPTY_STATS;

  const repository: GameRepository = {
    async loadCurrentGame() {
      calls.push('loadCurrentGame');
      return game;
    },
    async saveCurrentGame(next) {
      calls.push('saveCurrentGame');
      game = next;
    },
    async clearCurrentGame() {
      calls.push('clearCurrentGame');
      game = null;
    },
    async loadStats() {
      calls.push('loadStats');
      return stats;
    },
    async recordResult(level, result) {
      calls.push(`recordResult:${level}:${result}`);
      const field = result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'resigns';
      stats = { ...stats, [level]: { ...stats[level], [field]: stats[level][field] + 1 } };
    },
    async clearAll() {
      calls.push('clearAll');
      game = null;
      stats = EMPTY_STATS;
    },
  };

  return {
    repository,
    calls,
    countOf: (name: string) => calls.filter((c) => c.startsWith(name)).length,
    currentGame: () => game,
  };
}

function mountHook(repository: GameRepository) {
  const ref: { current: UsePersistence | null } = { current: null };
  const Probe = () => {
    ref.current = usePersistence(repository);
    return null;
  };
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(createElement(Probe));
  });
  return ref;
}

const at = (x: number, y: number): Point => ({ x, y });

/** Ván đang chơi thật, dựng qua `core/game` nên nó luôn hợp lệ. */
function playingGame(): GameState {
  let state = createGame('human');
  for (const [point, side] of [
    [at(0, 0), 'human'],
    [at(3, 3), 'ai'],
  ] as const) {
    const result = applyMove(state, point, side as Side);
    if (!result.ok) throw new Error('nuoc khong hop le trong fixture');
    state = result.state;
  }
  return state;
}

const SAVED: SavedGame = {
  moves: [{ at: at(0, 0), side: 'human' }] as Move[],
  first: 'human',
  level: 'hard' as Level,
  savedAt: '2026-09-04T00:00:00.000Z',
};

describe('usePersistence — đọc lúc vào app', () => {
  it('trước khi đọc xong thì restored là undefined, không phải null', async () => {
    const { repository } = fakeRepository();
    const ref = mountHook(repository);
    // Chưa flush microtask: giá trị đầu tiên phải phân biệt được "chưa biết".
    expect(ref.current?.restored).toBeUndefined();
    await act(async () => {});
    expect(ref.current?.restored).toBeNull();
  });

  it('có ván lưu thì trả đúng ván đó', async () => {
    const { repository } = fakeRepository({ game: SAVED });
    const ref = mountHook(repository);
    await act(async () => {});
    expect(ref.current?.restored).toEqual(SAVED);
  });

  it('đọc thống kê cùng lúc với ván, chỉ một lần mỗi lần vào', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    expect(ref.current?.stats).toEqual(EMPTY_STATS);
    expect(fake.countOf('loadCurrentGame')).toBe(1);
  });
});

describe('usePersistence — lưu ván', () => {
  it('ván đang chơi thì lưu', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.save(playingGame(), 'human', 'hard');
    });
    expect(fake.countOf('saveCurrentGame')).toBe(1);
    expect(fake.currentGame()?.moves).toHaveLength(2);
  });

  it('ván trống thì XOÁ chứ không lưu — không có gì để tiếp tục', async () => {
    const fake = fakeRepository({ game: SAVED });
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.save(createGame('human'), 'human', 'hard');
    });
    expect(fake.countOf('saveCurrentGame')).toBe(0);
    expect(fake.countOf('clearCurrentGame')).toBe(1);
    expect(fake.currentGame()).toBeNull();
  });

  it('ván đã kết thúc thì cũng XOÁ', async () => {
    const fake = fakeRepository({ game: SAVED });
    const ref = mountHook(fake.repository);
    await act(async () => {});
    const finished: GameState = {
      ...playingGame(),
      status: { kind: 'resigned', by: 'human' },
    };
    await act(async () => {
      ref.current?.save(finished, 'human', 'hard');
    });
    expect(fake.countOf('saveCurrentGame')).toBe(0);
    expect(fake.currentGame()).toBeNull();
  });

  it('mốc thời gian lưu ở UTC (NFR-I18N-02)', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.save(playingGame(), 'human', 'normal');
    });
    expect(fake.currentGame()?.savedAt).toMatch(/Z$/);
  });
});

describe('usePersistence — ghi kết quả', () => {
  it('ghi rồi đọc lại thống kê nên UI thấy số mới ngay', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.record('hard', 'win');
    });
    expect(ref.current?.stats.hard.wins).toBe(1);
  });

  it('mỗi lời gọi ghi đúng một lần — người gọi lo việc không gọi trùng', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.record('easy', 'loss');
    });
    expect(fake.countOf('recordResult')).toBe(1);
    expect(fake.calls).toContain('recordResult:easy:loss');
  });

  it('ba loại kết quả vào ba cột khác nhau', async () => {
    const fake = fakeRepository();
    const ref = mountHook(fake.repository);
    await act(async () => {});
    for (const result of ['win', 'loss', 'resign'] as GameResult[]) {
      await act(async () => {
        ref.current?.record('normal', result);
      });
    }
    expect(ref.current?.stats.normal).toEqual({ wins: 1, losses: 1, resigns: 1 });
  });
});

describe('usePersistence — xoá toàn bộ', () => {
  it('xoá xong thì thống kê về 0 và không còn ván nào', async () => {
    const fake = fakeRepository({ game: SAVED });
    const ref = mountHook(fake.repository);
    await act(async () => {});
    await act(async () => {
      ref.current?.record('hard', 'win');
    });
    await act(async () => {
      ref.current?.clearAll();
    });
    expect(ref.current?.stats).toEqual(EMPTY_STATS);
    expect(ref.current?.restored).toBeNull();
    expect(fake.currentGame()).toBeNull();
  });
});
