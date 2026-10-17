import type { Side } from '@/game/core/types';
import type { PieceSet } from './types';

/**
 * HÌNH của bốn bộ quân, tả MỘT LẦN — FR-20 · ADR-0027.
 *
 * Vì sao là dữ liệu chứ không phải hai hàm vẽ: cùng một hình phải xuất hiện ở **hai
 * nơi** — trên canvas (bàn cờ) và trong DOM dưới dạng SVG (thanh hai ghế, ô chọn bộ
 * quân, danh sách nước đi, wordmark). Viết hai lần là mở đúng cái lệch âm thầm mà
 * `MASTER.md` §3a chống: hình mang thông tin "quân của ai", nên hình trên bàn khác
 * hình trong bảng chọn là làm người chơi chọn một thứ và nhận một thứ khác — và không
 * test nào đỏ vì cả hai đều "đúng".
 *
 * Toạ độ tính theo **đơn vị nửa-ô**: `1` là nửa cạnh ô đã trừ phần thụt vào
 * (`MASTER.md` §6). Hai bộ vẽ chỉ việc nhân với `half` của mình, nên không bộ nào tự
 * quyết kích thước.
 */
export type Pt = readonly [x: number, y: number];

export type Prim =
  /** Các đoạn thẳng rời nhau — mỗi cặp điểm là một nét. Dùng cho ✕ và mỏ vịt. */
  | { readonly kind: 'segments'; readonly pts: readonly Pt[] }
  /** Đa giác ĐÓNG, chỉ viền. Tam giác, vuông. */
  | { readonly kind: 'poly'; readonly pts: readonly Pt[] }
  | {
      readonly kind: 'circle';
      readonly c: Pt;
      readonly r: number;
      /** `true` = tô đặc. Đây là khác biệt duy nhất giữa bộ Đặc/rỗng và bộ Bút chì. */
      readonly fill?: boolean;
    }
  /** Đường cong Bézier bậc ba: điểm đầu, rồi từng đoạn `[c1, c2, tới]`. */
  | {
      readonly kind: 'curve';
      readonly from: Pt;
      readonly segs: readonly (readonly [Pt, Pt, Pt])[];
      readonly close?: boolean;
    };

export type PieceShape = readonly Prim[];

const X: PieceShape = [
  {
    kind: 'segments',
    pts: [
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ],
  },
];

const RING: PieceShape = [{ kind: 'circle', c: [0, 0], r: 1 }];

/** Bán kính nhỏ hơn vòng rỗng, để hai bộ không nhìn giống nhau ở ô nhỏ. */
const DOT: PieceShape = [{ kind: 'circle', c: [0, 0], r: 0.82, fill: true }];

/** Dịch xuống một chút: tam giác có trọng tâm thấp hơn tâm hình học của nó. */
const TRIANGLE: PieceShape = [
  {
    kind: 'poly',
    pts: [
      [0, -1.05],
      [1, 0.78],
      [-1, 0.78],
    ],
  },
];

/** 0.86 để hình vuông không đọc thành "cả ô bị tô" ở mức phóng nhỏ. */
const SQUARE: PieceShape = [
  {
    kind: 'poly',
    pts: [
      [-0.86, -0.86],
      [0.86, -0.86],
      [0.86, 0.86],
      [-0.86, 0.86],
    ],
  },
];

/**
 * Con vịt — bộ mang tên sản phẩm, và là bộ MỎNG NHẤT trong bốn bộ.
 *
 * Ba nét (đầu, mỏ, thân) ở ô 28px đã sát ngưỡng đọc được, nên nó phải qua được lần
 * nhìn tận mắt của `NFR-A11Y-07`; không qua thì **bỏ bộ đó**, không sửa màu để cứu nó
 * (bất biến 16 · ADR-0027 §Hệ quả).
 */
const DUCK: PieceShape = [
  { kind: 'circle', c: [0.32, -0.44], r: 0.3 },
  {
    kind: 'segments',
    pts: [
      [0.6, -0.52],
      [0.96, -0.4],
      [0.96, -0.4],
      [0.6, -0.26],
    ],
  },
  {
    kind: 'curve',
    from: [0.22, -0.12],
    segs: [
      [
        [-0.64, -0.12],
        [-0.96, 0.3],
        [-0.6, 0.64],
      ],
      [
        [-0.26, 0.96],
        [0.96, 0.8],
        [0.92, 0.06],
      ],
    ],
  },
];

/**
 * Quả trứng — hẹp TRÊN, phình DƯỚI, để không nhìn thành vòng tròn của bộ Bút chì.
 *
 * Bốn đoạn, và **tiếp tuyến ở cả đỉnh lẫn đáy phải NẰM NGANG** — đó là toàn bộ mẹo.
 * Hai bản trước sai đúng chỗ đó: điểm điều khiển cạnh đỉnh đặt ở `y = -0.94`, tức lệch
 * khỏi đỉnh `y = -1`, nên hai đoạn gặp nhau thành một GÓC và hình đọc ra quả nhót.
 * Đặt chúng ở đúng `y = -1` (và `y = 1` ở đáy) thì hai đầu tròn.
 *
 * Chỗ phình rộng nhất ở `y = 0.10`, tức DƯỚI tâm: đó là thứ làm nó ra trứng chứ không
 * ra ellipse. Vai trên thu vào (0.92) hơn vai dưới (0.96).
 *
 * Cả ba lần sửa đều là do NHÌN, không do test — hình đúng hay sai không có cách nào
 * khẳng định bằng code.
 */
const EGG: PieceShape = [
  {
    kind: 'curve',
    from: [0, -1],
    segs: [
      [
        [0.52, -1],
        [0.92, -0.4],
        [0.94, 0.1],
      ],
      [
        [0.96, 0.64],
        [0.54, 1],
        [0, 1],
      ],
      [
        [-0.54, 1],
        [-0.96, 0.64],
        [-0.94, 0.1],
      ],
      [
        [-0.92, -0.4],
        [-0.52, -1],
        [0, -1],
      ],
    ],
    close: true,
  },
];

/**
 * Bảng tra: bộ → ghế → hình.
 *
 * Là DỮ LIỆU, không phải một chuỗi `if`. Thêm bộ thứ năm là thêm một dòng ở đây, một
 * giá trị trong `PIECE_SETS` và một nhãn trong `lib/strings` — không phải một nhánh
 * mới trong tầng render hay trong tầng view.
 */
export const PIECE_SHAPES: Readonly<
  Record<PieceSet, Readonly<Record<Side, PieceShape>>>
> = {
  pencil: { one: X, two: RING },
  solid: { one: DOT, two: RING },
  geo: { one: TRIANGLE, two: SQUARE },
  duck: { one: DUCK, two: EGG },
};
