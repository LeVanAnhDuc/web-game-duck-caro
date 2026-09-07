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
