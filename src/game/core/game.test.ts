import { describe, expect, it } from 'vitest';
import { applyMove, createGame, replay, resign, undo } from './game';
import { HOTSEAT, VS_AI, type GameState, type Side } from './types';

const play = (state: GameState, x: number, y: number, side: Side): GameState => {
  const result = applyMove(state, { x, y }, side);
  if (!result.ok) throw new Error(`nuoc bi tu choi: ${result.reason}`);
  return result.state;
};

/** Ván mà ghế một ăn năm ở hàng 0; ghế hai đánh xa ra hàng 5 nên không chặn được. */
function oneWinsGame(): GameState {
  let state = createGame('one');
  for (let i = 0; i < 4; i += 1) {
    state = play(state, i, 0, 'one');
    state = play(state, i, 5, 'two');
  }
  return play(state, 4, 0, 'one');
}

describe('createGame', () => {
  it('ván trống, đúng ghế đi trước, đang chơi', () => {
    const state = createGame('two');
    expect(state.moves).toHaveLength(0);
    expect(state.toMove).toBe('two');
    expect(state.status.kind).toBe('playing');
  });

  it('luật mặc định là caro Việt, và nó nằm TRONG ván', () => {
    expect(createGame('one').rule).toBe('blocked');
    expect(createGame('one', 'free').rule).toBe('free');
  });
});

describe('applyMove', () => {
  it('đổi lượt sau mỗi nước', () => {
    expect(play(createGame('one'), 0, 0, 'one').toMove).toBe('two');
  });

  it('từ chối ô đã có quân (NFR-REL-02)', () => {
    const state = play(createGame('one'), 0, 0, 'one');
    expect(applyMove(state, { x: 0, y: 0 }, 'two')).toEqual({
      ok: false,
      reason: 'occupied',
    });
  });

  it('từ chối nước của ghế chưa tới lượt', () => {
    expect(applyMove(createGame('one'), { x: 0, y: 0 }, 'two')).toEqual({
      ok: false,
      reason: 'not-your-turn',
    });
  });

  it('từ chối mọi nước sau khi ván đã kết thúc', () => {
    const state = oneWinsGame();
    expect(state.status.kind).toBe('won');
    expect(applyMove(state, { x: 9, y: 9 }, 'two')).toEqual({
      ok: false,
      reason: 'game-over',
    });
  });

  it('đặt trạng thái won kèm chuỗi thắng khi đủ năm', () => {
    const state = oneWinsGame();
    expect(state.status).toMatchObject({ kind: 'won', by: 'one' });
    if (state.status.kind === 'won') expect(state.status.line).toHaveLength(5);
  });

  it('nước ở toạ độ âm vẫn vào ván bình thường', () => {
    const state = play(createGame('one'), -3, -9, 'one');
    expect(state.moves[0]?.at).toEqual({ x: -3, y: -9 });
  });

  /*
   * Bất biến 14 ở tầng ván: cùng một chuỗi nước, hai luật, hai kết cục. Nếu luật bị
   * lấy từ đâu khác ngoài `state.rule` thì đây là test đỏ trước tiên.
   */
  it('luật của VÁN quyết kết cục, không phải một tham số ngoài', () => {
    const blocked = (rule: 'blocked' | 'free') => {
      // ghế hai chặn sẵn ô (-1,0); ghế một ăn từ 0..4; ghế hai chặn nốt ô (5,0).
      let s = createGame('one', rule);
      s = play(s, 0, 0, 'one');
      s = play(s, -1, 0, 'two');
      s = play(s, 1, 0, 'one');
      s = play(s, 5, 0, 'two');
      s = play(s, 2, 0, 'one');
      s = play(s, 9, 9, 'two');
      s = play(s, 3, 0, 'one');
      s = play(s, 8, 8, 'two');
      return play(s, 4, 0, 'one');
    };
    expect(blocked('blocked').status.kind).toBe('playing');
    expect(blocked('free').status).toMatchObject({ kind: 'won', by: 'one' });
  });
});

describe('undo — đấu máy bỏ HAI nước', () => {
  it('bỏ nước của mình và nước máy đáp lại', () => {
    let state = createGame('one');
    state = play(state, 0, 0, 'one');
    state = play(state, 1, 1, 'two');
    state = play(state, 2, 0, 'one');
    state = play(state, 3, 3, 'two');
    const back = undo(state, 'one', VS_AI);
    expect(back.moves).toHaveLength(2);
    expect(back.toMove).toBe('one');
  });

  it('hoàn từ ván chỉ có một nước thì về ván trống, không âm', () => {
    const state = play(createGame('one'), 0, 0, 'one');
    expect(undo(state, 'one', VS_AI).moves).toHaveLength(0);
  });

  it('hoàn từ ván trống là không làm gì', () => {
    expect(undo(createGame('one'), 'one', VS_AI).moves).toHaveLength(0);
  });

  it('trạng thái sau undo BẰNG trạng thái dựng lại từ moves đã cắt (bất biến 1)', () => {
    let state = createGame('one');
    state = play(state, 0, 0, 'one');
    state = play(state, 1, 1, 'two');
    state = play(state, 2, 0, 'one');
    state = play(state, 3, 3, 'two');
    expect(undo(state, 'one', VS_AI)).toEqual(replay(state.moves.slice(0, 2), 'one'));
  });

  it('hoàn nước xoá cả trạng thái thắng', () => {
    expect(undo(oneWinsGame(), 'one', VS_AI).status.kind).toBe('playing');
  });
});

describe('undo — hot-seat bỏ MỘT nước', () => {
  /*
   * US-05: bỏ hai nước ở hot-seat là xoá luôn nước của người kia — họ không bấm gì
   * mà mất một nước. Đây là chỗ quán tính từ chế độ đấu máy gây lỗi.
   */
  it('trả lại đúng nước vừa đánh, và lượt về lại ghế vừa đánh', () => {
    let state = createGame('one');
    state = play(state, 0, 0, 'one');
    state = play(state, 1, 1, 'two');
    state = play(state, 2, 0, 'one');
    const back = undo(state, 'one', HOTSEAT);
    expect(back.moves).toHaveLength(2);
    expect(back.toMove).toBe('one');
  });

  it('hoàn hai lần liên tiếp bỏ đúng hai nước, mỗi lần một nước', () => {
    let state = createGame('one');
    state = play(state, 0, 0, 'one');
    state = play(state, 1, 1, 'two');
    state = play(state, 2, 0, 'one');
    const once = undo(state, 'one', HOTSEAT);
    const twice = undo(once, 'one', HOTSEAT);
    expect(twice.moves).toHaveLength(1);
    expect(twice.toMove).toBe('two');
  });

  it('giữ nguyên luật của ván qua mỗi lần hoàn', () => {
    let state = createGame('one', 'free');
    state = play(state, 0, 0, 'one');
    state = play(state, 1, 1, 'two');
    expect(undo(state, 'one', HOTSEAT).rule).toBe('free');
  });
});

describe('replay', () => {
  it('dựng lại đúng ván từ danh sách nước đi', () => {
    const state = oneWinsGame();
    expect(replay(state.moves, 'one')).toEqual(state);
  });

  it('dựng lại giữ đúng luật được truyền vào', () => {
    expect(replay([], 'one', 'free').rule).toBe('free');
  });

  it('ném lỗi khi danh sách nước đi không hợp lệ', () => {
    expect(() =>
      replay(
        [
          { at: { x: 0, y: 0 }, side: 'one' },
          { at: { x: 0, y: 0 }, side: 'two' },
        ],
        'one',
      ),
    ).toThrow();
  });
});

describe('resign', () => {
  it('ghi ghế bỏ ván và đóng ván', () => {
    const state = resign(createGame('one'), 'one');
    expect(state.status).toEqual({ kind: 'resigned', by: 'one' });
    expect(applyMove(state, { x: 0, y: 0 }, 'one').ok).toBe(false);
  });
});
