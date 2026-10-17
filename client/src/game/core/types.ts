/** Toạ độ một Ô. Số nguyên, ÂM ĐƯỢC — bàn không có biên (ADR-0002). */
export type Point = { readonly x: number; readonly y: number };

/**
 * Một trong hai GHẾ của ván. Không dùng `Player`/`Color` — xem `docs/01-product/glossary.md`.
 *
 * `Side` nói GHẾ NÀO, **không** nói ai điều khiển ghế đó (ADR-0024). Ai ngồi là việc
 * của `Controller`, và việc đó nằm ngoài `core` hoàn toàn. Bất biến 15: không code nào
 * được suy ra "đây là máy" từ `side === 'two'` — chỉ `mode[side] === 'engine'` trả lời
 * được câu đó.
 *
 * Không đặt tên ghế theo HÌNH quân (`'x'`/`'o'`): hình đổi được theo bộ quân người chơi
 * chọn (ADR-0027), nên tên như thế sẽ nói dối ngay khi họ đổi bộ.
 */
export type Side = 'one' | 'two';

/** Ai ngồi ở một ghế. Sống ở tầng trên `core` (ADR-0024). */
export type Controller = 'human' | 'engine';

/** Ánh xạ ghế → người điều khiển. Đây là thứ phân biệt hot-seat với đấu máy. */
export type Mode = Readonly<Record<Side, Controller>>;

export const VS_AI: Mode = { one: 'human', two: 'engine' };
export const HOTSEAT: Mode = { one: 'human', two: 'human' };

/** Có ghế nào do engine cầm không — dùng thay cho mọi phép đoán theo tên ghế. */
export const hasEngine = (mode: Mode): boolean =>
  mode.one === 'engine' || mode.two === 'engine';

/**
 * Luật thắng (ADR-0025).
 *
 * `'blocked'` — caro Việt: đủ năm quân liền thì thắng, TRỪ KHI bị chặn cả hai đầu.
 * `'free'`    — tự do: đủ năm quân liền là thắng, kể cả khi bị chặn cả hai đầu.
 *
 * Luật thuộc về VÁN, không thuộc cài đặt (bất biến 14). Cài đặt chỉ giữ `defaultRule`
 * để điền sẵn màn bắt đầu — nếu luật lấy từ cài đặt thì mở lại một ván lưu sau khi đổi
 * cài đặt sẽ cho kết quả KHÁC trên cùng một chuỗi nước.
 */
export type Rule = 'blocked' | 'free';

export const DEFAULT_RULE: Rule = 'blocked';

/**
 * Quân trong một ô = ghế sở hữu nó. Hình do tầng render quyết định, không phải dữ liệu:
 * ADR-0008 nói HÌNH mang thông tin, màu chỉ là lớp dư thừa; ADR-0027 nói hình nào là
 * lựa chọn của người chơi. Không dùng `Stone` — đó là từ vựng cờ vây (ADR-0009).
 */
export type Mark = Side;

export type Move = { readonly at: Point; readonly side: Side };

export type Level = 'easy' | 'normal' | 'hard';

/** Không có `draw`: bàn vô hạn không bao giờ hết ô (ADR-0003). */
export type GameStatus =
  | { readonly kind: 'playing' }
  | { readonly kind: 'won'; readonly by: Side; readonly line: readonly Point[] }
  | { readonly kind: 'resigned'; readonly by: Side };

/**
 * `moves` là NGUỒN ĐÚNG. Bàn dẫn xuất từ nó và không nằm ở đây (bất biến 1).
 *
 * `rule` nằm ở ĐÂY, không ở cài đặt: một ván phải được xử bằng đúng luật đã sinh ra nó,
 * kể cả nhiều tháng sau khi lưu (bất biến 14).
 */
export type GameState = {
  readonly moves: readonly Move[];
  readonly toMove: Side;
  readonly rule: Rule;
  readonly status: GameStatus;
};

export const WIN_LENGTH = 5;

/** Bốn trục. Mỗi trục xét cả hai chiều bằng cách đi ngược lại trong `maximalRun`. */
export const DIRECTIONS: readonly Point[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: -1 },
];

export const opponentOf = (side: Side): Side => (side === 'one' ? 'two' : 'one');
