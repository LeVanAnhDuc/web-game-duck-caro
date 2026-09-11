import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { useGame, type UseGame } from './useGame';
import type { Engine } from '@/game/ai/Engine';
import {
  HOTSEAT,
  VS_AI,
  type Level,
  type Mode,
  type Move,
  type Point,
  type Rule,
  type Side,
} from '@/game/core/types';
import type { SavedGame } from '@/game/storage/types';

/**
 * Gắn hook vào một cây React thật rồi trả ref tới giá trị mới nhất của nó.
 * Dùng `createElement` thay vì JSX để test giữ đuôi `.ts` — không phải vì JSX sai,
 * mà vì một file test không cần thêm một bước transform để chạy.
 */
function mountHook(
  engine: Engine,
  first: Side = 'one',
  level: Level = 'normal',
  mode: Mode = VS_AI,
  rule: Rule = 'blocked',
) {
  const ref: { current: UseGame | null } = { current: null };
  const Probe = () => {
    ref.current = useGame(engine, { first, level, mode, rule });
    return null;
  };
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(createElement(Probe));
  });
  return ref;
}

const engineThatPlays = (at: Point): Engine => ({
  bestMove: vi.fn().mockResolvedValue(at),
});

function deferredEngine() {
  let resolveAi: (p: Point) => void = () => {};
  const engine: Engine = {
    bestMove: () =>
      new Promise<Point>((resolve) => {
        resolveAi = resolve;
      }),
  };
  return { engine, play: (p: Point) => resolveAi(p) };
}

describe('useGame', () => {
  it('nước của người chơi vào ván, rồi máy đáp lại', async () => {
    const ref = mountHook(engineThatPlays({ x: 1, y: 1 }));
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.state.moves).toHaveLength(2);
    expect(ref.current?.state.moves[1]?.side).toBe('two');
    expect(ref.current?.thinking).toBe(false);
  });

  it('đánh vào ô đã có quân thì hiện thông báo và không thêm nước', async () => {
    const ref = mountHook(engineThatPlays({ x: 1, y: 1 }));
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    await act(async () => {
      ref.current?.place({ x: 1, y: 1 });
    });
    expect(ref.current?.state.moves).toHaveLength(2);
    expect(ref.current?.notice).toBe('Ô đó đã có quân');
  });

  it('nước thứ hai bấm khi chưa tới lượt bị bỏ qua (NFR-REL-02)', async () => {
    const { engine, play } = deferredEngine();
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.thinking).toBe(true);
    await act(async () => {
      ref.current?.place({ x: 5, y: 5 });
    });
    expect(ref.current?.state.moves).toHaveLength(1);
    await act(async () => {
      play({ x: 1, y: 1 });
    });
    expect(ref.current?.state.moves).toHaveLength(2);
  });

  it('kết quả engine cũ bị BỎ nếu đã hoàn nước trong lúc chờ (bất biến 7)', async () => {
    const { engine, play } = deferredEngine();
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    await act(async () => {
      ref.current?.undoMove();
    });
    await act(async () => {
      play({ x: 9, y: 9 });
    });
    expect(ref.current?.state.moves).toHaveLength(0);
    expect(ref.current?.thinking).toBe(false);
  });

  it('máy đi trước thì tự đánh ngay khi vào', async () => {
    const ref = mountHook(engineThatPlays({ x: 0, y: 0 }), 'two');
    await act(async () => {});
    expect(ref.current?.state.moves).toHaveLength(1);
    expect(ref.current?.state.moves[0]?.side).toBe('two');
  });

  it('bỏ ván đóng ván lại và chặn mọi nước sau đó', async () => {
    const ref = mountHook(engineThatPlays({ x: 1, y: 1 }));
    await act(async () => {
      ref.current?.giveUp();
    });
    expect(ref.current?.state.status.kind).toBe('resigned');
    await act(async () => {
      ref.current?.place({ x: 3, y: 3 });
    });
    expect(ref.current?.state.moves).toHaveLength(0);
  });

  it('restart dựng ván mới và cho máy đi trước nếu được chọn', async () => {
    const ref = mountHook(engineThatPlays({ x: 2, y: 2 }));
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.state.moves).toHaveLength(2);
    await act(async () => {
      ref.current?.restart({ first: 'two', level: 'hard', mode: VS_AI, rule: 'blocked' });
    });
    expect(ref.current?.state.moves).toHaveLength(1);
    expect(ref.current?.state.moves[0]?.side).toBe('two');
  });

  it('engine ném lỗi thì ván không treo ở trạng thái đang nghĩ (NFR-REL-03)', async () => {
    const engine: Engine = { bestMove: () => Promise.reject(new Error('vo')) };
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.thinking).toBe(false);
    expect(ref.current?.notice).toBe('Máy không trả lời kịp — thử đánh lại một nước');
  });
});

describe('useGame — tiếp tục ván đã lưu', () => {
  const savedWith = (
    moves: readonly Move[],
    first: Side = 'one',
    mode: Mode = VS_AI,
  ): SavedGame => ({
    moves,
    first,
    level: 'hard',
    mode,
    rule: 'blocked',
    savedAt: '2026-09-04T00:00:00.000Z',
  });

  it('dựng lại đúng số nước và đúng lượt đi', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    const saved = savedWith([
      { at: { x: 0, y: 0 }, side: 'one' },
      { at: { x: 1, y: 1 }, side: 'two' },
      { at: { x: 2, y: 0 }, side: 'one' },
      { at: { x: 3, y: 3 }, side: 'two' },
    ]);
    let ok = false;
    await act(async () => {
      ok = ref.current?.resume(saved) ?? false;
    });
    expect(ok).toBe(true);
    expect(ref.current?.state.moves).toHaveLength(4);
    expect(ref.current?.state.toMove).toBe('one');
  });

  it('ván lưu HỎNG thì trả false và không làm vỡ app (NFR-REL-04)', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    // Hai nước cùng một ô: đúng kiểu dữ liệu nhưng không phải ván hợp lệ.
    const broken = savedWith([
      { at: { x: 0, y: 0 }, side: 'one' },
      { at: { x: 0, y: 0 }, side: 'two' },
    ]);
    let ok = true;
    await act(async () => {
      ok = ref.current?.resume(broken) ?? true;
    });
    expect(ok).toBe(false);
    expect(ref.current?.state.moves).toHaveLength(0);
  });

  it('hai nước liền của cùng một bên cũng bị từ chối', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    const broken = savedWith([
      { at: { x: 0, y: 0 }, side: 'one' },
      { at: { x: 1, y: 1 }, side: 'one' },
    ]);
    let ok = true;
    await act(async () => {
      ok = ref.current?.resume(broken) ?? true;
    });
    expect(ok).toBe(false);
  });

  it('rời đi đúng lượt máy thì vào lại máy nghĩ tiếp', async () => {
    const ref = mountHook(engineThatPlays({ x: 5, y: 5 }));
    const saved = savedWith([{ at: { x: 0, y: 0 }, side: 'one' }]);
    await act(async () => {
      ref.current?.resume(saved);
    });
    expect(ref.current?.state.moves).toHaveLength(2);
    expect(ref.current?.state.moves[1]?.at).toEqual({ x: 5, y: 5 });
  });

  it('kết quả engine từ ván TRƯỚC bị bỏ khi resume chen vào (bất biến 7)', async () => {
    const { engine, play } = deferredEngine();
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    const saved = savedWith([
      { at: { x: 7, y: 7 }, side: 'one' },
      { at: { x: 8, y: 8 }, side: 'two' },
    ]);
    await act(async () => {
      ref.current?.resume(saved);
    });
    await act(async () => {
      play({ x: 1, y: 1 });
    });
    expect(ref.current?.state.moves).toHaveLength(2);
    expect(ref.current?.state.moves[0]?.at).toEqual({ x: 7, y: 7 });
  });
});

describe('useGame — gợi ý (FR-10 · ADR-0016)', () => {
  it('hỏi engine ở mức Khó kể cả khi đang chơi mức Dễ', async () => {
    const engine = engineThatPlays({ x: 3, y: 3 });
    const ref = mountHook(engine, 'one', 'easy');
    await act(async () => {
      ref.current?.askHint();
    });
    expect(engine.bestMove).toHaveBeenCalledWith([], 'one', 'hard', 'blocked');
  });

  it('gợi ý KHÔNG thêm nước nào vào ván', async () => {
    const ref = mountHook(engineThatPlays({ x: 3, y: 3 }));
    await act(async () => {
      ref.current?.askHint();
    });
    expect(ref.current?.state.moves).toHaveLength(0);
    expect(ref.current?.hint).toEqual({ x: 3, y: 3 });
    expect(ref.current?.notice).toBe('Gợi ý: đánh ở 3, 3.');
  });

  it('engine hỏng thì báo và không treo ở trạng thái đang tìm', async () => {
    const engine: Engine = { bestMove: vi.fn().mockRejectedValue(new Error('nổ')) };
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.askHint();
    });
    expect(ref.current?.hint).toBeNull();
    expect(ref.current?.hinting).toBe(false);
    expect(ref.current?.notice).toBe('Chưa tìm được gợi ý — thử lại một lượt nữa');
  });

  it('chưa tới lượt mình thì không hỏi engine', async () => {
    const { engine, play } = deferredEngine();
    const spy = vi.spyOn(engine, 'bestMove');
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    // Máy đang nghĩ: đúng một lời gọi, và askHint không được thêm lời gọi thứ hai.
    await act(async () => {
      ref.current?.askHint();
    });
    expect(spy).toHaveBeenCalledTimes(1);
    await act(async () => {
      play({ x: 5, y: 5 });
    });
  });

  it('hoàn nước trong lúc đang xin gợi ý thì gợi ý đó bị bỏ (bất biến 7)', async () => {
    const { engine, play } = deferredEngine();
    const ref = mountHook(engine);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    await act(async () => {
      play({ x: 1, y: 1 });
    });
    await act(async () => {
      ref.current?.askHint();
    });
    await act(async () => {
      ref.current?.undoMove();
    });
    await act(async () => {
      play({ x: 7, y: 7 });
    });
    expect(ref.current?.hint).toBeNull();
  });

  it('đánh một nước thì gợi ý cũ biến mất', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    await act(async () => {
      ref.current?.askHint();
    });
    expect(ref.current?.hint).not.toBeNull();
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.hint).toBeNull();
  });
});

describe('useGame — xem lại ván (FR-09)', () => {
  /**
   * Bỏ ván là cách rẻ nhất để có một ván ĐÃ KẾT THÚC với đúng n nước.
   *
   * Máy phải đánh mỗi lượt một ô KHÁC NHAU: một engine luôn trả cùng một ô thì nước
   * thứ hai của nó rơi vào ô đã có quân, `applyMove` từ chối, và ván ngắn hơn mong
   * đợi mà không có lỗi nào nổ ra.
   */
  async function resignedAfter(moves: number) {
    let replies = 0;
    const engine: Engine = {
      bestMove: vi.fn(async () => ({ x: 50, y: replies++ })),
    };
    const ref = mountHook(engine);
    for (let i = 0; i < moves / 2; i += 1) {
      await act(async () => {
        ref.current?.place({ x: i, y: 0 });
      });
    }
    await act(async () => {
      ref.current?.giveUp();
    });
    return ref;
  }

  it('ván chưa kết thúc thì không vào được chế độ xem lại', async () => {
    const ref = mountHook(engineThatPlays({ x: 1, y: 1 }));
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    await act(async () => {
      ref.current?.enterReview();
    });
    expect(ref.current?.reviewAt).toBeNull();
  });

  it('vào xem lại thì đứng ở nước cuối', async () => {
    const ref = await resignedAfter(4);
    await act(async () => {
      ref.current?.enterReview();
    });
    expect(ref.current?.reviewAt).toBe(4);
  });

  it('nhảy ra ngoài khoảng thì bị kẹp vào hai biên', async () => {
    const ref = await resignedAfter(4);
    await act(async () => {
      ref.current?.enterReview();
    });
    await act(async () => {
      ref.current?.gotoMove(-5);
    });
    expect(ref.current?.reviewAt).toBe(0);
    await act(async () => {
      ref.current?.gotoMove(999);
    });
    expect(ref.current?.reviewAt).toBe(4);
  });

  it('thoát xem lại về null', async () => {
    const ref = await resignedAfter(4);
    await act(async () => {
      ref.current?.enterReview();
    });
    await act(async () => {
      ref.current?.exitReview();
    });
    expect(ref.current?.reviewAt).toBeNull();
  });

  it('MOI thao tác xem lại đều không đụng tới state.moves (bất biến 1)', async () => {
    const ref = await resignedAfter(4);
    const before = ref.current?.state.moves;
    await act(async () => {
      ref.current?.enterReview();
    });
    await act(async () => {
      ref.current?.gotoMove(1);
    });
    await act(async () => {
      ref.current?.gotoMove(3);
    });
    await act(async () => {
      ref.current?.exitReview();
    });
    expect(ref.current?.state.moves).toBe(before);
    expect(ref.current?.state.moves).toHaveLength(4);
  });

  it('chơi lại thì thoát khỏi chế độ xem lại', async () => {
    const ref = await resignedAfter(4);
    await act(async () => {
      ref.current?.enterReview();
    });
    await act(async () => {
      ref.current?.resetToMenu();
    });
    expect(ref.current?.reviewAt).toBeNull();
  });

  it('bắt đầu ván mới thì thoát khỏi chế độ xem lại', async () => {
    const ref = await resignedAfter(4);
    await act(async () => {
      ref.current?.enterReview();
    });
    await act(async () => {
      ref.current?.restart({ first: 'one', level: 'hard', mode: VS_AI, rule: 'blocked' });
    });
    expect(ref.current?.reviewAt).toBeNull();
  });
});

/**
 * Bất biến 15 ở tầng hook. Cả khối này canh một thứ: ở hot-seat, engine KHÔNG BAO GIỜ
 * được gọi. Nếu ở đâu đó code suy ra "đây là máy" từ `side === 'two'` thay vì từ
 * `mode[side] === 'engine'`, thì đây là bộ test duy nhất đỏ — mọi test khác vẫn xanh,
 * vì `'two'` đúng là ghế của máy ở chế độ đấu máy.
 */
describe('useGame — hot-seat (FR-17 · US-05)', () => {
  it('bốn nước liên tiếp, engine không được gọi lần nào', async () => {
    const engine = engineThatPlays({ x: 9, y: 9 });
    const ref = mountHook(engine, 'one', 'normal', HOTSEAT);

    for (const at of [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]) {
      await act(async () => {
        ref.current?.place(at);
      });
    }

    expect(engine.bestMove).not.toHaveBeenCalled();
    expect(ref.current?.state.moves).toHaveLength(4);
  });

  it('lượt đổi qua lại giữa hai ghế, và cả hai ghế đều đánh được', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }), 'one', 'normal', HOTSEAT);
    expect(ref.current?.state.toMove).toBe('one');

    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    expect(ref.current?.state.toMove).toBe('two');

    await act(async () => {
      ref.current?.place({ x: 1, y: 0 });
    });
    expect(ref.current?.state.toMove).toBe('one');
    expect(ref.current?.state.moves.map((move) => move.side)).toEqual(['one', 'two']);
  });

  it('hoàn nước lùi MỘT nước, không phải hai', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }), 'one', 'normal', HOTSEAT);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    await act(async () => {
      ref.current?.place({ x: 1, y: 0 });
    });
    await act(async () => {
      ref.current?.undoMove();
    });
    expect(ref.current?.state.moves).toHaveLength(1);
    expect(ref.current?.state.toMove).toBe('two');
  });

  it('bỏ ván ghi ĐÚNG ghế đang đi, không cố định ghế một', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }), 'one', 'normal', HOTSEAT);
    await act(async () => {
      ref.current?.place({ x: 0, y: 0 });
    });
    // Giờ tới lượt ghế hai; ghế hai bỏ ván.
    await act(async () => {
      ref.current?.giveUp();
    });
    expect(ref.current?.state.status).toEqual({ kind: 'resigned', by: 'two' });
  });

  it('tiếp tục một ván hot-seat đã lưu KHÔNG khởi động engine', async () => {
    const engine = engineThatPlays({ x: 9, y: 9 });
    const ref = mountHook(engine, 'one', 'normal', HOTSEAT);
    // Ván lưu dừng ở lượt ghế hai — đúng chỗ mà `toMove === 'two'` sẽ gọi engine.
    const saved: SavedGame = {
      moves: [{ at: { x: 0, y: 0 }, side: 'one' }],
      first: 'one',
      level: 'hard',
      mode: HOTSEAT,
      rule: 'blocked',
      savedAt: '2026-09-11T00:00:00.000Z',
    };
    await act(async () => {
      ref.current?.resume(saved);
    });
    expect(ref.current?.state.toMove).toBe('two');
    expect(engine.bestMove).not.toHaveBeenCalled();
  });

  it('luật của ván đi theo vào hook, và ván tự xử bằng luật đó', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }), 'one', 'normal', HOTSEAT, 'free');
    expect(ref.current?.state.rule).toBe('free');

    // Ghế hai chặn trước một đầu, ghế một ăn năm, ghế hai chặn nốt đầu kia.
    const script: readonly Point[] = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 5, y: 0 },
      { x: 2, y: 0 },
      { x: 9, y: 9 },
      { x: 3, y: 0 },
      { x: 8, y: 8 },
      { x: 4, y: 0 },
    ];
    for (const at of script) {
      await act(async () => {
        ref.current?.place(at);
      });
    }
    // Năm quân bị chặn cả hai đầu: thắng ở luật `free`, không thắng ở luật kia.
    expect(ref.current?.state.status).toMatchObject({ kind: 'won', by: 'one' });
  });
});
