import { buildBoard, isEmpty } from './board';
import { winningLine } from './rules';
import {
  DEFAULT_RULE,
  hasEngine,
  opponentOf,
  type GameState,
  type Mode,
  type Move,
  type Point,
  type Rule,
  type Side,
} from './types';

/**
 * `rule` đi vào ván ngay lúc tạo và không đổi được sau đó (bất biến 14 · ADR-0025).
 *
 * Mặc định `DEFAULT_RULE` để 253 test cũ và mọi chỗ chỉ quan tâm luật caro Việt không
 * phải nêu nó ra. Cố ý KHÔNG đọc `settingsStore` ở đây: `core` không biết cài đặt là gì
 * (bất biến 4), và luật lấy từ cài đặt là đúng cái bất biến 14 cấm.
 */
export function createGame(first: Side, rule: Rule = DEFAULT_RULE): GameState {
  return { moves: [], toMove: first, rule, status: { kind: 'playing' } };
}

export type ApplyResult =
  | { readonly ok: true; readonly state: GameState }
  | { readonly ok: false; readonly reason: 'occupied' | 'not-your-turn' | 'game-over' };

export function applyMove(state: GameState, at: Point, side: Side): ApplyResult {
  if (state.status.kind !== 'playing') return { ok: false, reason: 'game-over' };
  if (state.toMove !== side) return { ok: false, reason: 'not-your-turn' };
  if (!isEmpty(buildBoard(state.moves), at)) return { ok: false, reason: 'occupied' };

  const moves: readonly Move[] = [...state.moves, { at, side }];
  // Luật lấy từ CHÍNH VÁN NÀY, không từ tham số ngoài và không từ cài đặt.
  const line = winningLine(buildBoard(moves), at, state.rule);

  return {
    ok: true,
    state: {
      moves,
      toMove: opponentOf(side),
      rule: state.rule,
      status: line === null ? { kind: 'playing' } : { kind: 'won', by: side, line },
    },
  };
}

/**
 * Dựng lại trạng thái từ một danh sách nước đi. `moves` là nguồn đúng, nên hàm này
 * định nghĩa ý nghĩa của mọi trạng thái — `undo` và xem lại ván đều đi qua nó, nên
 * chúng không thể lệch khỏi nó (bất biến 1).
 */
export function replay(
  moves: readonly Move[],
  first: Side,
  rule: Rule = DEFAULT_RULE,
): GameState {
  let state = createGame(first, rule);
  for (const move of moves) {
    const result = applyMove(state, move.at, move.side);
    if (!result.ok) {
      throw new Error(`nuoc khong hop le khi dung lai van: ${result.reason}`);
    }
    state = result.state;
  }
  return state;
}

/**
 * Hoàn nước — số nước bỏ đi PHỤ THUỘC CHẾ ĐỘ (ADR-0024 · US-05).
 *
 * Đấu máy bỏ **hai** nước, vì bỏ một nước sẽ trả bàn về lượt của máy và máy đánh lại
 * ngay — người chơi bấm Hoàn mà bàn không đổi gì.
 *
 * Hot-seat bỏ **một** nước, vì ở đó "hoàn" nghĩa đúng là trả lại nước vừa đánh. Bỏ hai
 * nước ở hot-seat là xoá luôn nước của người kia — họ không bấm gì mà mất một nước.
 */
export function undo(state: GameState, first: Side, mode: Mode): GameState {
  const steps = hasEngine(mode) ? 2 : 1;
  const keep = Math.max(0, state.moves.length - steps);
  return replay(state.moves.slice(0, keep), first, state.rule);
}

export function resign(state: GameState, by: Side): GameState {
  return { ...state, status: { kind: 'resigned', by } };
}
