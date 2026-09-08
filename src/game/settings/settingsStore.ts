import type { Level } from '@/game/core/types';
import { settingsKey } from '@/game/storage/keys';
import { createSafeStorage, type SafeStorage } from '@/game/storage/safeStorage';

/**
 * Cài đặt của MÁY, không của người — ADR-0019.
 *
 * Không đi qua `GameRepository`: seam đó tồn tại cho dữ liệu sẽ đồng bộ theo tài khoản
 * ngày ghép Ducker ID (ADR-0006), và cài đặt cố ý nằm ngoài. Tắt tiếng ở máy công ty
 * không được làm im máy ở nhà.
 *
 * ĐỒNG BỘ, khác `GameRepository` vốn async: cài đặt sẽ không bao giờ đi qua mạng, nên
 * một `Promise` ở đây là lớp bọc không có seam nào bên dưới.
 */
export type Settings = {
  readonly sound: boolean;
  readonly defaultLevel: Level;
};

export const DEFAULT_SETTINGS: Settings = { sound: true, defaultLevel: 'normal' };

const LEVELS: readonly Level[] = ['easy', 'normal', 'hard'];

/**
 * Kiểm hình dạng, không kiểm luật chơi — cùng ranh giới như `game/storage`.
 *
 * Một mức khó lạ (từ bản cũ, hoặc do người sửa tay trong DevTools) phải bị bỏ, không
 * được đi tiếp vào `useGame`: ở đó nó thành một khoá tra bảng không tồn tại, và AI
 * sẽ chạy với cấu hình `undefined` — vẫn đánh, chỉ là đánh sai.
 */
function parse(raw: string): Settings {
  const value: unknown = JSON.parse(raw);
  if (typeof value !== 'object' || value === null) return DEFAULT_SETTINGS;
  const shape = value as { sound?: unknown; defaultLevel?: unknown };
  if (typeof shape.sound !== 'boolean') return DEFAULT_SETTINGS;
  if (!LEVELS.includes(shape.defaultLevel as Level)) return DEFAULT_SETTINGS;
  return { sound: shape.sound, defaultLevel: shape.defaultLevel as Level };
}

export function createSettingsStore(storage: SafeStorage = createSafeStorage()) {
  return {
    /** Không bao giờ ném. Dữ liệu hỏng hay bị chặn đều trả về mặc định (NFR-REL-04). */
    load(): Settings {
      const raw = storage.read(settingsKey());
      if (raw === null) return DEFAULT_SETTINGS;
      try {
        return parse(raw);
      } catch {
        return DEFAULT_SETTINGS;
      }
    },

    /** `false` nghĩa là không ghi được. Mất một lựa chọn nhỏ, không phải một lỗi. */
    save(next: Settings): boolean {
      return storage.write(settingsKey(), JSON.stringify(next));
    },
  };
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;
