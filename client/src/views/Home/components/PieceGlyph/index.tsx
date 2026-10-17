// types
import { PIECE_SHAPES, type Prim } from '@/game/appearance/shapes';
import type { PieceSet } from '@/game/appearance/types';
import type { Side } from '@/game/core/types';

/**
 * Hình quân trong DOM, dưới dạng SVG — dùng ở thanh hai ghế, ô chọn bộ quân, màn bắt
 * đầu, danh sách nước đi và màn kết ván.
 *
 * Đọc CÙNG dữ liệu hình với canvas (`game/appearance/shapes.ts`). Đó là điểm của cả
 * file này: hình mang thông tin "quân của ai" (ADR-0008), nên hình trong bảng chọn mà
 * khác hình trên bàn là làm người chơi chọn một thứ và nhận một thứ khác — và không
 * test nào đỏ, vì cả hai bản đều "đúng" theo bản thân chúng.
 *
 * MASTER.md §9 cấm dingbat/emoji làm icon, nên đây là SVG, không phải ký tự `✕`/`◯`.
 */
const VIEW = 24;
/** Nét 12% cạnh ô (MASTER.md §6), quy về hệ toạ độ `viewBox`. */
const STROKE = 2.9;
const HALF = 9.4;

const at = (v: number): string => (VIEW / 2 + v * HALF).toFixed(2);

function primPath(prim: Prim): { d: string; fill: boolean } | null {
  if (prim.kind === 'segments') {
    const parts: string[] = [];
    for (let i = 0; i + 1 < prim.pts.length; i += 2) {
      const a = prim.pts[i];
      const b = prim.pts[i + 1];
      if (a === undefined || b === undefined) continue;
      parts.push(`M${at(a[0])} ${at(a[1])}L${at(b[0])} ${at(b[1])}`);
    }
    return { d: parts.join(''), fill: false };
  }

  if (prim.kind === 'poly') {
    const [first, ...rest] = prim.pts;
    if (first === undefined) return null;
    const body = rest.map((p) => `L${at(p[0])} ${at(p[1])}`).join('');
    return { d: `M${at(first[0])} ${at(first[1])}${body}Z`, fill: false };
  }

  if (prim.kind === 'circle') {
    // Vòng tròn tả bằng hai cung nửa vòng — giữ mọi hình trong đúng một loại phần tử,
    // nên không có nhánh `<circle>` riêng để quên cập nhật.
    const cx = VIEW / 2 + prim.c[0] * HALF;
    const cy = VIEW / 2 + prim.c[1] * HALF;
    const r = prim.r * HALF;
    const d =
      `M${(cx - r).toFixed(2)} ${cy.toFixed(2)}` +
      `a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(r * 2).toFixed(2)} 0` +
      `a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-r * 2).toFixed(2)} 0`;
    return { d, fill: prim.fill === true };
  }

  const segs = prim.segs
    .map(
      ([c1, c2, to]) =>
        `C${at(c1[0])} ${at(c1[1])} ${at(c2[0])} ${at(c2[1])} ${at(to[0])} ${at(to[1])}`,
    )
    .join('');
  return {
    d: `M${at(prim.from[0])} ${at(prim.from[1])}${segs}${prim.close === true ? 'Z' : ''}`,
    fill: false,
  };
}

export function PieceGlyph({
  side,
  set,
  size = 16,
  className,
  inherit = false,
}: {
  side: Side;
  set: PieceSet;
  size?: number;
  className?: string;
  /**
   * `true` = THỪA màu từ chỗ đặt glyph, thay vì dùng màu quân của ghế.
   *
   * Cần cho nền TỐI: `--mark-one` là `#12100E`, đúng bằng `--ink-strong` — nên
   * quân của ghế một đặt trên một nút đang chọn (`bg-ink-strong`) là đen trên đen,
   * tức tàng hình. Tìm ra bằng cách nhìn màn bắt đầu, không bằng test.
   *
   * Mất màu ở đây KHÔNG mất thông tin: ADR-0008 nói HÌNH mang thông tin "quân của
   * ai", màu chỉ là lớp dư. Hình vẫn nguyên.
   */
  inherit?: boolean;
}) {
  const paths = PIECE_SHAPES[set][side]
    .map(primPath)
    .filter((p): p is { d: string; fill: boolean } => p !== null);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      fill="none"
      aria-hidden="true"
      className={`block flex-none ${className ?? ''}`}
      /*
       * Màu luôn là một BIẾN của palette, không bao giờ là một hex — nên component
       * này không có đường nào lọt một màu mới vào sản phẩm (bất biến 16).
       */
      style={inherit ? undefined : { color: `var(--mark-${side})` }}
    >
      {paths.map((path, i) => (
        <path
          key={i}
          d={path.d}
          stroke={path.fill ? 'none' : 'currentColor'}
          fill={path.fill ? 'currentColor' : 'none'}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
