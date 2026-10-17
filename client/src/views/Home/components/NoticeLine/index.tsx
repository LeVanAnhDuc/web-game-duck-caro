// types
import type { GameState } from '@/game/core/types';
// others
import { strings } from '@/lib/strings';

/**
 * Vùng `aria-live` của sản phẩm — `NFR-A11Y-06`. Nó đọc ra từng nước kèm toạ độ, kết
 * quả ván, và các thông báo tạm ("Ô đó đã có quân", "Máy không trả lời kịp").
 *
 * Tách ra từ `StatusLine` cũ ở mốc 8. `StatusLine` làm hai việc: nói lượt của ai, và
 * đọc thông báo. Việc thứ nhất chuyển hẳn sang `SeatBar` (ADR-0028) vì ở hot-seat nó
 * là thông tin chính của màn hình; việc thứ hai ở lại đây.
 *
 * **Cố ý GIỮ phần nhìn thấy, dù mockup đã duyệt không vẽ nó.** Bỏ đi thì "Ô đó đã có
 * quân" và "Máy không trả lời kịp" chỉ còn screen reader nghe được, tức mất phản hồi
 * cho người nhìn bằng mắt — đó là mất chức năng để đổi lấy độ khớp với một bản vẽ.
 * Phần lệch này đã được nói ra và canvas được cập nhật theo.
 */
export function NoticeLine({
  state,
  thinking,
  notice,
  variant,
}: {
  state: GameState;
  thinking: boolean;
  notice: string | null;
  variant: 'bar' | 'panel';
}) {
  const text =
    notice ??
    (thinking
      ? strings.aiThinking
      : state.moves.length === 0
        ? strings.dragHint
        : '');

  if (variant === 'bar') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-[2.25rem] flex-none border-t border-edge bg-raised px-4 py-2 text-xs leading-5 text-ink-muted"
      >
        {text}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-edge px-4 py-3 text-xs leading-5 text-ink-muted"
    >
      {text}
    </div>
  );
}
