// types
import type { PieceSet } from '@/game/appearance/types';
import type { GameState, Mode, Side } from '@/game/core/types';
// components
import { PieceGlyph } from '../PieceGlyph';
// others
import { strings } from '@/lib/strings';

/** Cao 56px và LUÔN chiếm chỗ đó — xem ghi chú về chiều cao bàn bên dưới. */
const BAR = 'relative flex h-14 flex-none border-b border-edge bg-raised';
/* Chưa vào ván: vẫn chiếm 56px, nhưng mang nền giấy và không có viền, nên nó
   chìm vào khung bàn thay vì thành một dải trắng lạ dưới header. */
const BAR_EMPTY = 'relative flex h-14 flex-none bg-paper';

/**
 * Thanh hai ghế — ADR-0028. Thay phần "tới lượt ai" của `StatusLine` cũ.
 *
 * Ở chế độ đấu máy, "tới lượt ai" gần như không cần nói: không phải bạn thì là máy.
 * Hot-seat phá giả định đó — hai người nhìn chung một màn hình, không ai là "bạn", và
 * lượt của ai trở thành **thông tin chính của màn hình**. Bản mockup đầu giữ nguyên
 * dòng chữ 37px cũ và bị bác ở buổi duyệt vì đúng lý do đó.
 *
 * Dùng chung cho CẢ HAI chế độ: tên ghế đọc từ `Mode` (`strings.seatName`), nên không
 * có hai component song song cho cùng một việc.
 *
 * Thông tin mang bằng **vị trí và độ đậm** trước — nửa nào sáng hơn và đậm hơn là nửa
 * đang đi — màu chỉ là lớp dư. Cùng nguyên tắc ADR-0008 áp cho quân trên bàn, nên ảnh
 * xám hoá vẫn đọc được.
 *
 * **THANH NÀY LUÔN CHIẾM 56px, kể cả khi chưa có ván.** Đó không phải lựa chọn thẩm mỹ
 * mà là cách chặn một lớp bug: bản đầu tôi viết `{started && <SeatBar/>}`, nên khung
 * bàn thụt 56px ngay lúc bắt đầu ván, camera giữ nguyên `oy`, và cú bấm đầu tiên vào
 * giữa bàn rơi vào ô (0,−1). Bấm vẫn ra MỘT ô, chỉ là ô sai — ở caro thì một nước nhầm
 * là mất ván. E2E bắt được (`play.spec.ts`), và lần chữa đầu (tự đưa camera về giữa khi
 * bàn trống) vẫn để lọt đúng lỗi đó ở đường TIẾP TỤC VÁN ĐÃ LƯU, nơi ván đã có quân
 * trước khi thanh xuất hiện. Giữ chiều cao bàn KHÔNG ĐỔI là cách duy nhất đóng cả hai.
 */
export function SeatBar({
  state,
  mode,
  thinking,
  pieceSet,
  visible,
}: {
  state: GameState;
  mode: Mode;
  thinking: boolean;
  pieceSet: PieceSet;
  /** `false` khi chưa vào ván: thanh vẫn chiếm chỗ, chỉ không hiện gì. */
  visible: boolean;
}) {
  if (!visible) return <div className={BAR_EMPTY} aria-hidden="true" />;

  const status = state.status;
  /*
   * Ván đã kết thúc thì ghế được làm nổi là ghế THẮNG, không phải ghế tới lượt — lúc
   * đó không còn lượt của ai. Bỏ ván thì không ghế nào nổi: kết quả đó thuộc về khối
   * kết ván, và một thanh ghi "Lượt Người 2" bên trên "Người 1 thắng" là panel tự nói
   * ngược chính nó.
   */
  const highlighted: Side | null =
    status.kind === 'playing' ? state.toMove : status.kind === 'won' ? status.by : null;

  const seat = (side: Side) => {
    const active = highlighted === side;
    const engineThinking =
      active && thinking && status.kind === 'playing' && mode[side] === 'engine';

    return (
      <div
        key={side}
        className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] px-2 text-sm transition-colors ${
          active
            ? 'border-b-current bg-paper font-semibold'
            : 'border-b-transparent text-ink-muted'
        }`}
        // Gạch chân mang màu quân CỦA GHẾ ĐÓ. Chữ vẫn `--ink-strong` để giữ tương phản
        // 4.5:1 (NFR-A11Y-01) — màu quân không đủ cho chữ nhỏ.
        style={{ color: active ? `var(--mark-${side})` : undefined }}
      >
        <PieceGlyph
          side={side}
          set={pieceSet}
          size={20}
          className={active ? '' : 'opacity-40'}
        />
        <span className={active ? 'text-ink-strong' : ''}>
          {engineThinking ? strings.aiThinking : strings.seatName(side, mode)}
        </span>
      </div>
    );
  };

  return (
    <div className={BAR}>
      {(['one', 'two'] as const).map(seat)}
      {/*
        Số nước ngồi trên vạch chia. Ở giữa chứ không ở mép: hai nửa phải cân nhau, vì
        cái mang thông tin là "nửa nào sáng hơn" và một nửa rộng hơn sẽ phá phép so đó.
      */}
      <span
        aria-label={strings.moveCount(state.moves.length)}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-edge bg-raised px-2 py-0.5 font-mono text-xs leading-4 text-ink-muted"
      >
        {state.moves.length}
      </span>
    </div>
  );
}
