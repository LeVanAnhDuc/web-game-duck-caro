import { beforeEach, describe, expect, it } from 'vitest';
import { VS_AI, type Move } from '@/game/core/types';
import { createLocalGameRepository } from './localGameRepository';
import { currentGameKey, statsKey } from './keys';
import { createSafeStorage, type SafeStorage } from './safeStorage';
import { EMPTY_STATS, type SavedGame } from './types';

/** `localStorage` giả, sờ được vào ruột để dựng dữ liệu hỏng. */
function fakeBacking(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  } as Storage;
}

const throwingBacking = (): Storage =>
  ({
    get length(): number {
      throw new Error('bi chan');
    },
    key: () => {
      throw new Error('bi chan');
    },
    getItem: () => {
      throw new Error('bi chan');
    },
    setItem: () => {
      throw new Error('het dung luong');
    },
    removeItem: () => {
      throw new Error('bi chan');
    },
    clear: () => {
      throw new Error('bi chan');
    },
  }) as unknown as Storage;

/** Phan HOP LE dung chung cho moi fixture JSON tho ben duoi. */
const OK_TAIL =
  '"mode":{"one":"human","two":"engine"},"rule":"blocked","savedAt":"x"';

const MOVES: Move[] = [
  { at: { x: 0, y: 0 }, side: 'one' },
  { at: { x: -1, y: 2 }, side: 'two' },
];

const GAME: SavedGame = {
  moves: MOVES,
  first: 'one',
  level: 'hard',
  mode: VS_AI,
  rule: 'blocked',
  savedAt: '2026-09-04T00:00:00.000Z',
};

describe('localGameRepository — ván đang chơi', () => {
  let storage: SafeStorage;

  beforeEach(() => {
    storage = createSafeStorage(fakeBacking());
  });

  it('lưu rồi đọc lại ra đúng ván, kể cả toạ độ âm', async () => {
    const repo = createLocalGameRepository(storage);
    await repo.saveCurrentGame(GAME);
    expect(await repo.loadCurrentGame()).toEqual(GAME);
  });

  it('chưa có gì thì trả null, không phải ván rỗng', async () => {
    expect(await createLocalGameRepository(storage).loadCurrentGame()).toBeNull();
  });

  it('xoá rồi thì không còn ván nào', async () => {
    const repo = createLocalGameRepository(storage);
    await repo.saveCurrentGame(GAME);
    await repo.clearCurrentGame();
    expect(await repo.loadCurrentGame()).toBeNull();
  });

  it('JSON hỏng → null, không ném', async () => {
    const backing = fakeBacking({ [currentGameKey()]: '{ khong phai json' });
    const repo = createLocalGameRepository(createSafeStorage(backing));
    await expect(repo.loadCurrentGame()).resolves.toBeNull();
  });

  it('đúng JSON nhưng sai hình dạng → null', async () => {
    /*
     * Mỗi dòng chỉ được sai ĐÚNG MỘT chỗ, và chỗ đó là chỗ tên ca nói. Ở mốc 8 cả
     * khối này từng đỏ vì `"first":"human"` — giá trị của `Side` cũ — nên mọi dòng
     * trả null vì lý do sai. Một bộ test xanh vì lý do sai thì không canh gì cả.
     */
    for (const bad of [
      '{"moves":"khong phai mang","first":"one","level":"hard",' + OK_TAIL + '}',
      '{"moves":[{"at":{"x":0},"side":"one"}],"first":"one","level":"hard",' + OK_TAIL + '}',
      '{"moves":[],"first":"nguoi","level":"hard",' + OK_TAIL + '}',
      '{"moves":[],"first":"one","level":"sieu kho",' + OK_TAIL + '}',
      '{"moves":[],"first":"one","level":"hard","mode":{"one":"human","two":"engine"},"rule":"blocked"}',
      // mode và rule mới ở v2: thiếu, hoặc mang giá trị lạ, đều phải bị bỏ.
      '{"moves":[],"first":"one","level":"hard","rule":"blocked","savedAt":"x"}',
      '{"moves":[],"first":"one","level":"hard","mode":{"one":"human"},"rule":"blocked","savedAt":"x"}',
      '{"moves":[],"first":"one","level":"hard","mode":{"one":"human","two":"robot"},"rule":"blocked","savedAt":"x"}',
      '{"moves":[],"first":"one","level":"hard","mode":{"one":"human","two":"engine"},"savedAt":"x"}',
      '{"moves":[],"first":"one","level":"hard","mode":{"one":"human","two":"engine"},"rule":"renju","savedAt":"x"}',
      '[]',
      'null',
      '42',
    ]) {
      const repo = createLocalGameRepository(
        createSafeStorage(fakeBacking({ [currentGameKey()]: bad })),
      );
      expect(await repo.loadCurrentGame(), bad).toBeNull();
    }
  });

  it('toạ độ không phải số nguyên bị từ chối — bàn chỉ có ô nguyên', async () => {
    const bad =
      '{"moves":[{"at":{"x":0.5,"y":0},"side":"one"}],"first":"one","level":"hard",' +
      OK_TAIL +
      '}';
    const repo = createLocalGameRepository(
      createSafeStorage(fakeBacking({ [currentGameKey()]: bad })),
    );
    expect(await repo.loadCurrentGame()).toBeNull();
  });

  it('khoá lạ thêm bằng tay không đi tiếp vào ứng dụng', async () => {
    const withExtra =
      '{"moves":[],"first":"one","level":"hard",' + OK_TAIL + ',"cheat":true}';
    const repo = createLocalGameRepository(
      createSafeStorage(fakeBacking({ [currentGameKey()]: withExtra })),
    );
    const loaded = await repo.loadCurrentGame();
    expect(loaded).not.toBeNull();
    expect(Object.keys(loaded ?? {}).sort()).toEqual([
      'first',
      'level',
      'mode',
      'moves',
      'rule',
      'savedAt',
    ]);
  });
});

describe('localGameRepository — thống kê', () => {
  it('chưa có gì thì mọi mức đều bằng 0', async () => {
    const repo = createLocalGameRepository(createSafeStorage(fakeBacking()));
    expect(await repo.loadStats()).toEqual(EMPTY_STATS);
  });

  it('đếm riêng theo từng mức — ván Dễ không làm đẹp thành tích Khó', async () => {
    const repo = createLocalGameRepository(createSafeStorage(fakeBacking()));
    await repo.recordResult('easy', 'win');
    await repo.recordResult('easy', 'win');
    await repo.recordResult('hard', 'loss');
    await repo.recordResult('hard', 'resign');
    const stats = await repo.loadStats();
    expect(stats.easy).toEqual({ wins: 2, losses: 0, resigns: 0 });
    expect(stats.hard).toEqual({ wins: 0, losses: 1, resigns: 1 });
    expect(stats.normal).toEqual({ wins: 0, losses: 0, resigns: 0 });
  });

  it('bảng hỏng ở một mức thì chỉ mất mức đó', async () => {
    const partly = JSON.stringify({
      easy: { wins: 3, losses: 1, resigns: 0 },
      normal: 'rac',
      hard: { wins: -5, losses: 2.5, resigns: 1 },
    });
    const repo = createLocalGameRepository(
      createSafeStorage(fakeBacking({ [statsKey()]: partly })),
    );
    const stats = await repo.loadStats();
    expect(stats.easy).toEqual({ wins: 3, losses: 1, resigns: 0 });
    expect(stats.normal).toEqual({ wins: 0, losses: 0, resigns: 0 });
    // Số âm và số thập phân đều không phải số lần chơi.
    expect(stats.hard).toEqual({ wins: 0, losses: 0, resigns: 1 });
  });
});

describe('localGameRepository — xoá toàn bộ (NFR-DATA-04)', () => {
  it('xoá cả ván, cả thống kê, và cả rác của version cũ', async () => {
    const backing = fakeBacking({
      [currentGameKey()]: JSON.stringify(GAME),
      [statsKey()]: JSON.stringify(EMPTY_STATS),
      'gomoku:v0:local:currentGame': 'rac cua version cu',
      'mot-khoa-cua-app-khac': 'phai con lai',
    });
    const repo = createLocalGameRepository(createSafeStorage(backing));
    await repo.clearAll();
    expect(backing.getItem(currentGameKey())).toBeNull();
    expect(backing.getItem(statsKey())).toBeNull();
    expect(backing.getItem('gomoku:v0:local:currentGame')).toBeNull();
    expect(backing.getItem('mot-khoa-cua-app-khac')).toBe('phai con lai');
  });
});

describe('localGameRepository — lưu trữ bị chặn (NFR-REL-04)', () => {
  it('mọi lối vào đều ném thì repository vẫn chạy, chỉ là quên', async () => {
    const repo = createLocalGameRepository(createSafeStorage(throwingBacking()));
    await expect(repo.saveCurrentGame(GAME)).resolves.toBeUndefined();
    await expect(repo.loadCurrentGame()).resolves.toBeNull();
    await expect(repo.loadStats()).resolves.toEqual(EMPTY_STATS);
    await expect(repo.recordResult('hard', 'win')).resolves.toBeUndefined();
    await expect(repo.clearAll()).resolves.toBeUndefined();
  });

  it('không có window thì cũng không vỡ', async () => {
    const repo = createLocalGameRepository(createSafeStorage(null));
    await expect(repo.loadCurrentGame()).resolves.toBeNull();
    await expect(repo.saveCurrentGame(GAME)).resolves.toBeUndefined();
  });
});

describe('khoá lưu trữ', () => {
  it('mang version và chủ sở hữu, nên dữ liệu version khác không bị đọc tới', () => {
    expect(currentGameKey()).toBe('gomoku:v2:local:currentGame');
    expect(statsKey('nguoi-dung-42')).toBe('gomoku:v2:nguoi-dung-42:stats');
  });
});
