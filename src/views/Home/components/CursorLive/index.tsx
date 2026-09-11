// types
import type { Mode, Move, Point } from '@/game/core/types';
// game
import { buildBoard, markAt } from '@/game/core/board';
// others
import { strings } from '@/lib/strings';

/**
 * Vùng `aria-live` THỨ HAI, chỉ dành cho con trỏ bàn phím — FR-15 · NFR-A11Y-06.
 *
 * Vì sao không dùng chung vùng với `StatusLine`: vùng đó đọc SỰ KIỆN (nước đi, kết quả
 * ván, gợi ý). Nếu vị trí con trỏ đi vào cùng chỗ thì mỗi lần bấm mũi tên sẽ ghi đè lên
 * "Máy đánh ở 3, −2" — tức là dùng bàn phím làm MẤT đúng cái thông báo mà người dùng
 * bàn phím cần nhất.
 *
 * Đọc kèm tình trạng ô, vì người không thấy bàn cần biết ô đó trống hay không TRƯỚC khi
 * bấm Enter, không phải sau.
 */
export function CursorLive({
  cursor,
  moves,
  mode,
}: {
  cursor: Point | null;
  moves: readonly Move[];
  /**
   * Bất biến 15. Bản trước đọc ô của ghế hai là "quân của máy" — ở hot-seat đó là
   * một câu SAI đọc vào tai người dùng bàn phím ở mỗi ô, và ô của ghế một thì bị
   * gọi là "quân của bạn" với đúng một trong hai người.
   */
  mode: Mode;
}) {
  const text = (() => {
    if (cursor === null) return '';
    const mark = markAt(buildBoard(moves), cursor);
    const { x, y } = cursor;
    if (mark !== undefined) {
      return strings.cursorTakenBy(strings.seatName(mark, mode), x, y);
    }
    return strings.cursorEmpty(x, y);
  })();

  return (
    <p
      role="status"
      aria-live="polite"
      className="border-t border-edge px-4 py-1.5 text-xs leading-5 text-ink-muted empty:hidden"
    >
      {text}
    </p>
  );
}
