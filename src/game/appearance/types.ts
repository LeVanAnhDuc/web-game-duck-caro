/**
 * Lựa chọn TRÌNH BÀY của người chơi: giao diện sáng/tối (FR-19) và bộ quân (FR-20).
 *
 * Module LÁ — thuần TypeScript, không DOM, không import gì. Nó tồn tại vì hai module
 * cần cùng những kiểu này và không được phụ thuộc nhau:
 *
 * - `game/settings` LƯU chúng (`Settings`), nên nó cần kiểu và hàm kiểm hình dạng;
 * - `game/render` ĐỌC chúng (bảng hình, thuộc tính `data-theme`), nên nó cần kiểu.
 *
 * Đặt kiểu trong `game/render` rồi để `settings` import là phá bất biến 4 — ESLint đã
 * bắt đúng điều đó. Đặt trong `game/core` thì sai loại: đây không phải luật chơi, và
 * `core` không được biết sản phẩm trông thế nào.
 *
 * Phần chạm DOM (`applyTheme`, script chống nháy) nằm ở `game/render/theme.ts`, không
 * ở đây — nhờ vậy file này an toàn cho mọi module import.
 */

/**
 * BA trạng thái, không phải hai (ADR-0026). Bỏ `'system'` là lấy mất trạng thái mặc
 * định hiện tại: người để máy tự đổi theo giờ sẽ bị ghim cứng vào một bên ngay lần
 * đầu bấm.
 */
export type Theme = 'light' | 'dark' | 'system';

export const THEMES: readonly Theme[] = ['light', 'dark', 'system'];

export const DEFAULT_THEME: Theme = 'system';

export const isTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme);

/**
 * Bộ quân là một cặp HÌNH, và chỉ có thế (ADR-0027). Màu không thuộc về bộ quân —
 * mọi bộ vẽ bằng `--mark-one` / `--mark-two` đã có số đo (bất biến 16).
 */
export type PieceSet = 'pencil' | 'solid' | 'geo' | 'duck';

export const PIECE_SETS: readonly PieceSet[] = ['pencil', 'solid', 'geo', 'duck'];

export const DEFAULT_PIECE_SET: PieceSet = 'pencil';

export const isPieceSet = (value: unknown): value is PieceSet =>
  PIECE_SETS.includes(value as PieceSet);
