import { DEFAULT_RULE, type Level, type Rule } from '@/game/core/types';
import {
  DEFAULT_PIECE_SET,
  DEFAULT_THEME,
  isPieceSet,
  isTheme,
  type PieceSet,
  type Theme,
} from '@/game/appearance/types';
import { settingsKey } from '@/game/storage/keys';
import { createSafeStorage, type SafeStorage } from '@/game/storage/safeStorage';

/**
 * Cài đặt của MÁY, không của người — ADR-0019.
 *
 * Không đi qua `GameRepository`: seam đó tồn tại cho dữ liệu sẽ đồng bộ theo tài khoản
 * ngày ghép Ducker ID (ADR-0006), và cài đặt cố ý nằm ngoài. Tắt tiếng ở máy công ty
 * không được làm im máy ở nhà — và chọn nền tối ở đó cũng không được làm tối máy ở nhà.
 *
 * ĐỒNG BỘ, khác `GameRepository` vốn async: cài đặt sẽ không bao giờ đi qua mạng, nên
 * một `Promise` ở đây là lớp bọc không có seam nào bên dưới.
 *
 * `defaultRule` là **mặc định để điền sẵn màn bắt đầu**, không phải luật của ván đang
 * chơi — luật đó nằm trong `GameState.rule` (bất biến 14). Hai thứ cùng tên nhưng khác
 * chỗ, và lẫn chúng là cách làm một ván lưu cho ra hai kết cục.
 */
export type Settings = {
  readonly sound: boolean;
  readonly defaultLevel: Level;
  readonly theme: Theme;
  readonly pieceSet: PieceSet;
  readonly defaultRule: Rule;
};

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  defaultLevel: 'normal',
  theme: DEFAULT_THEME,
  pieceSet: DEFAULT_PIECE_SET,
  defaultRule: DEFAULT_RULE,
};

const LEVELS: readonly Level[] = ['easy', 'normal', 'hard'];
const RULES: readonly Rule[] = ['blocked', 'free'];

/**
 * Kiểm hình dạng, không kiểm luật chơi — cùng ranh giới như `game/storage`.
 *
 * Một giá trị lạ (từ bản cũ, hoặc do người sửa tay trong DevTools) phải bị bỏ, không
 * được đi tiếp: một mức khó lạ thành khoá tra bảng không tồn tại và AI chạy với cấu
 * hình `undefined` — vẫn đánh, chỉ là đánh sai; một tên bộ quân lạ thì canvas vẽ ra
 * không gì cả và bàn trông như hỏng camera.
 *
 * Một trường lạ làm **toàn bộ** về mặc định, không chỉ trường đó. Vá từng trường nghe
 * rộng lượng hơn nhưng nó sinh ra những tổ hợp nửa cũ nửa mới mà không ai test.
 */
function parse(raw: string): Settings {
  const value: unknown = JSON.parse(raw);
  if (typeof value !== 'object' || value === null) return DEFAULT_SETTINGS;
  const shape = value as {
    sound?: unknown;
    defaultLevel?: unknown;
    theme?: unknown;
    pieceSet?: unknown;
    defaultRule?: unknown;
  };
  if (typeof shape.sound !== 'boolean') return DEFAULT_SETTINGS;
  if (!LEVELS.includes(shape.defaultLevel as Level)) return DEFAULT_SETTINGS;
  if (!isTheme(shape.theme)) return DEFAULT_SETTINGS;
  if (!isPieceSet(shape.pieceSet)) return DEFAULT_SETTINGS;
  if (!RULES.includes(shape.defaultRule as Rule)) return DEFAULT_SETTINGS;
  return {
    sound: shape.sound,
    defaultLevel: shape.defaultLevel as Level,
    theme: shape.theme,
    pieceSet: shape.pieceSet,
    defaultRule: shape.defaultRule as Rule,
  };
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
