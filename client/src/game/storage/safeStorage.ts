/**
 * Lớp bọc `localStorage` không bao giờ ném.
 *
 * `NFR-REL-04`: bị chặn, đầy, hoặc dữ liệu hỏng thì game được phép **quên**, không
 * được phép **vỡ**. Mọi lối vào đều có thể ném ở trình duyệt thật:
 * - cửa sổ ẩn danh hoặc thiết lập chặn site data → chính `window.localStorage` ném
 *   khi đọc thuộc tính, chưa cần gọi hàm nào;
 * - hết dung lượng → `setItem` ném `QuotaExceededError`;
 * - Safari ở chế độ riêng tư từng cho `setItem` ném với dung lượng bằng 0.
 */
export type SafeStorage = {
  read(key: string): string | null;
  /** `false` nghĩa là không ghi được. Người gọi quyết định có quan tâm hay không. */
  write(key: string, value: string): boolean;
  remove(key: string): void;
  /** Mọi khoá đang có với tiền tố này. Dùng cho "xoá toàn bộ dữ liệu" (NFR-DATA-04). */
  keysWithPrefix(prefix: string): string[];
};

const NULL_STORAGE: SafeStorage = {
  read: () => null,
  write: () => false,
  remove: () => {},
  keysWithPrefix: () => [],
};

/** `null` khi không có storage nào dùng được — kể cả khi truy cập thuộc tính đã ném. */
function resolveBacking(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const backing = window.localStorage;
    // Chạm thật một lần: có trình duyệt chỉ ném lúc dùng, không ném lúc truy cập.
    const probe = '__gomoku_probe__';
    backing.setItem(probe, '1');
    backing.removeItem(probe);
    return backing;
  } catch {
    return null;
  }
}

export function createSafeStorage(backing: Storage | null = resolveBacking()): SafeStorage {
  if (backing === null) return NULL_STORAGE;

  return {
    read(key) {
      try {
        return backing.getItem(key);
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        backing.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        backing.removeItem(key);
      } catch {
        // Không xoá được thì cũng không có gì làm thêm.
      }
    },
    keysWithPrefix(prefix) {
      try {
        const found: string[] = [];
        for (let i = 0; i < backing.length; i += 1) {
          const key = backing.key(i);
          if (key !== null && key.startsWith(prefix)) found.push(key);
        }
        return found;
      } catch {
        return [];
      }
    },
  };
}
