/**
 * Version nằm TRONG tên khoá (ADR-0006). Đổi cấu trúc lưu là đổi `STORAGE_VERSION`,
 * và dữ liệu cũ đơn giản không được đọc tới — bỏ, không migrate. Không cần một hàm
 * migration nào, và cũng không có hàm nào để viết sai.
 */
export const STORAGE_VERSION = 'v1';

/**
 * Tiền tố chủ sở hữu. Hôm nay là hằng số `local`; ngày ghép Ducker ID nó thành id
 * người dùng, và dữ liệu của hai người trên cùng một máy không lẫn vào nhau.
 * KHÔNG viết `IdentityProvider` bây giờ — Ducker ID chưa có endpoint OAuth (ADR-0006).
 */
export const OWNER_LOCAL = 'local';

export const prefixFor = (owner: string = OWNER_LOCAL): string =>
  `gomoku:${STORAGE_VERSION}:${owner}:`;

export const currentGameKey = (owner?: string): string => `${prefixFor(owner)}currentGame`;

export const statsKey = (owner?: string): string => `${prefixFor(owner)}stats`;

/**
 * Tiền tố chung cho MỌI version, dùng khi người chơi xoá toàn bộ dữ liệu
 * (NFR-DATA-04) — xoá cả rác của những version cũ còn sót lại.
 */
export const ALL_VERSIONS_PREFIX = 'gomoku:';

/**
 * Khoá cài đặt — CỐ Ý không có tiền tố chủ sở hữu (ADR-0019).
 *
 * `prefixFor(owner)` gắn `local` hôm nay và id người dùng ngày ghép Ducker ID. Cài đặt
 * nằm ngoài cơ chế đó, và chính việc nằm ngoài là điều làm nó thuộc về CÁI MÁY chứ
 * không thuộc về người: tắt tiếng ở máy công ty không được làm im máy ở nhà.
 *
 * Vẫn mang `STORAGE_VERSION`, nên đổi cấu trúc cài đặt cũng là bỏ chứ không migrate.
 */
export const settingsKey = (): string => `gomoku:${STORAGE_VERSION}:settings`;
