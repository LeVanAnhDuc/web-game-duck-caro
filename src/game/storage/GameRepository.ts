import type { Level } from '@/game/core/types';
import type { GameResult, SavedGame, StatsByLevel } from './types';

/**
 * Ranh giới lưu trữ — đây là "seam Ducker ID" của ADR-0006.
 *
 * **Async ngay từ hôm nay** dù `localStorage` đồng bộ. Trả `Promise` bây giờ trông
 * rườm rà, nhưng nếu để đồng bộ thì ngày ghép remote phải sửa mọi lời gọi và mọi
 * component gọi nó — tức seam không còn là seam, chỉ là một lớp bọc. Mốc 3 đã chứng
 * minh lý lẽ này đúng một lần: `Engine` được để async từ mốc 2 và khi engine chuyển
 * vào Web Worker, không một chỗ gọi nào phải sửa.
 *
 * Cài đặt (âm thanh, mức mặc định) **không** đi qua đây: nó là thuộc tính của cái
 * máy đang ngồi, không phải của người. Đồng bộ nó theo tài khoản sẽ làm tắt tiếng ở
 * máy công ty thì máy nhà cũng im.
 */
export interface GameRepository {
  loadCurrentGame(): Promise<SavedGame | null>;
  saveCurrentGame(game: SavedGame): Promise<void>;
  clearCurrentGame(): Promise<void>;

  loadStats(): Promise<StatsByLevel>;
  recordResult(level: Level, result: GameResult): Promise<void>;

  /** Xoá sạch mọi dữ liệu game của mọi version (NFR-DATA-04). */
  clearAll(): Promise<void>;
}
