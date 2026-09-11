import {
  type PieceSet,
  PIECE_SETS,
} from '@/game/appearance/types';
import type { Side } from '@/game/core/types';

/**
 * HÌNH của bốn bộ quân — FR-20 · ADR-0027.
 *
 * Kiểu `PieceSet`, danh sách và hàm kiểm nằm ở `game/appearance/types.ts`, vì
 * `game/settings` cũng cần chúng. File này chỉ giữ phần biết CÁCH VẼ.
 *
 * Màu KHÔNG thuộc về bộ quân: mọi bộ vẽ bằng `palette.markOne` / `palette.markTwo`
 * đã có số đo trong `MASTER.md` §1 và §2 (bất biến 16). Đó là cửa duy nhất cho màu
 * vào sản phẩm, và nó đóng.
 *
 * Điều kiện để một bộ được nhận (`NFR-A11Y-07`): hai hình phân biệt được khi ảnh bị
 * **xám hoá**, và ở ô **16px** (`--cell-min`). Không đạt thì bỏ bộ đó — sửa màu để
 * cứu một cặp hình khó tách là phá đúng nguyên tắc ADR-0008 dựng lên.
 */
export type { PieceSet } from '@/game/appearance/types';
export {
  DEFAULT_PIECE_SET,
  isPieceSet,
  PIECE_SETS,
} from '@/game/appearance/types';

/**
 * Vẽ một quân, tại gốc toạ độ đã dịch vào TÂM ô và đã xoay.
 *
 * `half` là nửa cạnh ô đã trừ phần thụt vào (`MASTER.md` §6), nên mọi hình dùng chung
 * một hộp và không bộ nào tự quyết kích thước riêng. `ctx.strokeStyle` và `fillStyle`
 * do người gọi đặt trước — hàm ở đây **không** chạm màu.
 */
export type DrawPiece = (ctx: CanvasRenderingContext2D, half: number) => void;

const strokeX: DrawPiece = (ctx, half) => {
  ctx.beginPath();
  ctx.moveTo(-half, -half);
  ctx.lineTo(half, half);
  ctx.moveTo(half, -half);
  ctx.lineTo(-half, half);
  ctx.stroke();
};

const strokeRing: DrawPiece = (ctx, half) => {
  ctx.beginPath();
  ctx.arc(0, 0, half, 0, Math.PI * 2);
  ctx.stroke();
};

/** Chấm ĐẶC. Bán kính nhỏ hơn vòng rỗng để hai bộ không nhìn giống nhau ở ô nhỏ. */
const fillDot: DrawPiece = (ctx, half) => {
  ctx.beginPath();
  ctx.arc(0, 0, half * 0.82, 0, Math.PI * 2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
};

const strokeTriangle: DrawPiece = (ctx, half) => {
  // Dịch xuống một chút: tam giác có trọng tâm thấp hơn tâm hình học của nó.
  const top = -half * 1.05;
  const bottom = half * 0.78;
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.lineTo(half, bottom);
  ctx.lineTo(-half, bottom);
  ctx.closePath();
  ctx.stroke();
};

const strokeSquare: DrawPiece = (ctx, half) => {
  // 0.86 để hình vuông không đọc thành "cả ô bị tô" ở mức phóng nhỏ.
  const a = half * 0.86;
  ctx.beginPath();
  ctx.rect(-a, -a, a * 2, a * 2);
  ctx.stroke();
};

/**
 * Con vịt — bộ mang tên sản phẩm, và là bộ MỎNG NHẤT trong bốn bộ.
 *
 * Ba nét (đầu, mỏ, thân) ở ô 28px đã sát ngưỡng đọc được, nên nó phải qua được lần
 * nhìn tận mắt của `NFR-A11Y-07`; không qua thì bỏ (ADR-0027 §Hệ quả).
 */
const strokeDuck: DrawPiece = (ctx, half) => {
  const u = half / 10;
  ctx.beginPath();
  ctx.arc(3.2 * u, -4.4 * u, 3.0 * u, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(6.0 * u, -5.2 * u);
  ctx.lineTo(9.6 * u, -4.0 * u);
  ctx.lineTo(6.0 * u, -2.6 * u);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(2.2 * u, -1.2 * u);
  ctx.bezierCurveTo(-6.4 * u, -1.2 * u, -9.6 * u, 3.0 * u, -6.0 * u, 6.4 * u);
  ctx.bezierCurveTo(-2.6 * u, 9.6 * u, 9.6 * u, 8.0 * u, 9.2 * u, 0.6 * u);
  ctx.stroke();
};

/** Quả trứng — hẹp trên, phình dưới, để không nhìn thành vòng tròn của bộ Bút chì. */
const strokeEgg: DrawPiece = (ctx, half) => {
  ctx.beginPath();
  ctx.moveTo(0, -half);
  ctx.bezierCurveTo(half * 0.86, -half * 0.5, half, half * 0.42, 0, half);
  ctx.bezierCurveTo(-half, half * 0.42, -half * 0.86, -half * 0.5, 0, -half);
  ctx.stroke();
};

/**
 * Bảng tra: bộ → ghế → cách vẽ.
 *
 * Là DỮ LIỆU, không phải một chuỗi `if`. Thêm bộ thứ năm là thêm một dòng ở đây cộng
 * một nhãn trong `lib/strings`, không phải một nhánh mới trong tầng render.
 */
export const PIECE_SHAPES: Readonly<Record<PieceSet, Readonly<Record<Side, DrawPiece>>>> =
  {
    pencil: { one: strokeX, two: strokeRing },
    solid: { one: fillDot, two: strokeRing },
    geo: { one: strokeTriangle, two: strokeSquare },
    duck: { one: strokeDuck, two: strokeEgg },
  };
