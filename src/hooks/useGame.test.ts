import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { useGame, type UseGame } from './useGame';
import type { Engine } from '@/game/ai/Engine';
import type { Level, Move, Point, Side } from '@/game/core/types';
import type { SavedGame } from '@/game/storage/types';

/**
 * Gắn hook vào một cây React thật rồi trả ref tới giá trị mới nhất của nó.
 * Dùng `createElement` thay vì JSX để test giữ đuôi `.ts` — không phải vì JSX sai,
 * mà vì một file test không cần thêm một bước transform để chạy.
 */
function mountHook(engine: Engine, first: Side = 'human', level: Level = 'normal') {
  const ref: { current: UseGame | null } = { current: null };
  const Probe = () => {
    ref.current = useGame(engine, { first, level });
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
    expect(ref.current?.state.moves[1]?.side).toBe('ai');
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
    const ref = mountHook(engineThatPlays({ x: 0, y: 0 }), 'ai');
    await act(async () => {});
    expect(ref.current?.state.moves).toHaveLength(1);
    expect(ref.current?.state.moves[0]?.side).toBe('ai');
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
      ref.current?.restart({ first: 'ai', level: 'hard' });
    });
    expect(ref.current?.state.moves).toHaveLength(1);
    expect(ref.current?.state.moves[0]?.side).toBe('ai');
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
  const savedWith = (moves: readonly Move[], first: Side = 'human'): SavedGame => ({
    moves,
    first,
    level: 'hard',
    savedAt: '2026-09-04T00:00:00.000Z',
  });

  it('dựng lại đúng số nước và đúng lượt đi', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    const saved = savedWith([
      { at: { x: 0, y: 0 }, side: 'human' },
      { at: { x: 1, y: 1 }, side: 'ai' },
      { at: { x: 2, y: 0 }, side: 'human' },
      { at: { x: 3, y: 3 }, side: 'ai' },
    ]);
    let ok = false;
    await act(async () => {
      ok = ref.current?.resume(saved) ?? false;
    });
    expect(ok).toBe(true);
    expect(ref.current?.state.moves).toHaveLength(4);
    expect(ref.current?.state.toMove).toBe('human');
  });

  it('ván lưu HỎNG thì trả false và không làm vỡ app (NFR-REL-04)', async () => {
    const ref = mountHook(engineThatPlays({ x: 9, y: 9 }));
    // Hai nước cùng một ô: đúng kiểu dữ liệu nhưng không phải ván hợp lệ.
    const broken = savedWith([
      { at: { x: 0, y: 0 }, side: 'human' },
      { at: { x: 0, y: 0 }, side: 'ai' },
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
      { at: { x: 0, y: 0 }, side: 'human' },
      { at: { x: 1, y: 1 }, side: 'human' },
    ]);
    let ok = true;
    await act(async () => {
      ok = ref.current?.resume(broken) ?? true;
    });
    expect(ok).toBe(false);
  });

  it('rời đi đúng lượt máy thì vào lại máy nghĩ tiếp', async () => {
    const ref = mountHook(engineThatPlays({ x: 5, y: 5 }));
    const saved = savedWith([{ at: { x: 0, y: 0 }, side: 'human' }]);
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
      { at: { x: 7, y: 7 }, side: 'human' },
      { at: { x: 8, y: 8 }, side: 'ai' },
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
    const ref = mountHook(engine, 'human', 'easy');
    await act(async () => {
      ref.current?.askHint();
    });
    expect(engine.bestMove).toHaveBeenCalledWith([], 'human', 'hard');
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
      ref.current?.restart({ first: 'human', level: 'hard' });
    });
    expect(ref.current?.reviewAt).toBeNull();
  });
});
