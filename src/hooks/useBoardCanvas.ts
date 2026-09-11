'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameStatus, Move, Point, Side } from '@/game/core/types';
import {
  CELL_DEFAULT_DESKTOP,
  CELL_DEFAULT_MOBILE,
  clampCell,
  ensureVisible,
  fitToMoves,
  panBy,
  screenToCell,
  zoomAt,
  type Camera,
} from '@/game/render/camera';
import { readPalette, type Palette } from '@/game/render/palette';
import { DEFAULT_PIECE_SET, type PieceSet } from '@/game/render/pieceSets';
import { THEME_ATTR } from '@/game/render/theme';
import { drawFrame } from '@/game/render/renderer';
import { advanceGesture, beginGesture, isDrag, type Gesture } from './pointerGesture';

const MOBILE_MAX_WIDTH = 640;
const WHEEL_STEP_PX = 2;
/** Một lần bấm `+` / `-` đổi cạnh ô bấy nhiêu px. Lớn hơn bước lăn chuột vì bấm phím
 *  là hành động rời rạc, không liên tục. */
const KEY_ZOOM_STEP_PX = 4;

/** Mũi tên -> hướng trên bàn. `y` tăng xuống dưới, khớp toạ độ màn hình. */
const ARROWS: Readonly<Record<string, Point>> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

export type BoardCanvas = {
  readonly canvasRef: React.RefObject<HTMLCanvasElement | null>;
  readonly cam: Camera;
  readonly preview: Point | null;
  /** Ô con trỏ bàn phím đang trỏ tới. `null` = chưa ai dùng bàn phím (ADR-0020). */
  readonly cursor: Point | null;
  onPointerDown(e: React.PointerEvent<HTMLCanvasElement>): void;
  onPointerMove(e: React.PointerEvent<HTMLCanvasElement>): void;
  onPointerUp(e: React.PointerEvent<HTMLCanvasElement>): void;
  onWheel(e: React.WheelEvent<HTMLCanvasElement>): void;
  onKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>): void;
  recenter(): void;
  confirmPreview(): void;
  /** Dùng cho gợi ý (FR-10): đặt quân xem trước từ ngoài vào. */
  showPreview(at: Point): void;
  clearPreview(): void;
};

export function useBoardCanvas(args: {
  moves: readonly Move[];
  status: GameStatus;
  onPlace(at: Point): void;
  /** Bộ quân đang chọn (FR-20). Thuần trình bày — không ảnh hưởng ván nào. */
  pieceSet?: PieceSet;
  /**
   * Ghế ĐANG ĐI. Quân xem trước mang hình và màu của ghế này (ADR-0028) — đó là
   * tín hiệu "tới lượt ai" thứ hai, và là tín hiệu nằm đúng chỗ mắt đang nhìn.
   */
  previewSide?: Side;
}): BoardCanvas {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const centred = useRef(false);
  /** Đọc trong handler resize, vốn có deps rỗng — nên nó phải là ref, không phải prop. */
  const movesLen = useRef(args.moves.length);
  movesLen.current = args.moves.length;
  const [palette, setPalette] = useState<Palette | null>(null);
  const [cam, setCam] = useState<Camera>({ cell: CELL_DEFAULT_DESKTOP, ox: 0, oy: 0 });
  const [preview, setPreview] = useState<Point | null>(null);
  const [cursor, setCursor] = useState<Point | null>(null);

  const localPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  // Khớp canvas với kích thước thật và devicePixelRatio. Lần đầu thì đưa ô (0,0)
  // vào giữa; các lần sau KHÔNG giật khung nhìn của người chơi.
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (canvas == null || parent == null) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      /*
       * BÀN TRỐNG thì luôn mở ở GIỮA, kể cả khi khung vừa đổi kích thước.
       *
       * Không phải chuyện thẩm mỹ — đây là một bug thật ở mốc 8, do E2E bắt. `SeatBar`
       * chỉ hiện sau khi bắt đầu ván, nên khung bàn thụt 56px ngay lúc đó; camera giữ
       * nguyên `oy` nên ô (0,0) tụt xuống gần một ô, và cú bấm đầu tiên vào giữa bàn
       * rơi vào ô (0,−1). Bấm vẫn ra MỘT ô, chỉ là ô sai — đúng loại lệch mà bất biến
       * 11 cảnh báo, và ở caro thì một nước nhầm là mất ván.
       *
       * Điều kiện `moves.length === 0` là thứ làm nó an toàn: ván đang có quân thì
       * KHÔNG bao giờ tự dịch khung nhìn — đó là giật màn hình của người đang đánh, và
       * `backlog.md` §Nợ kỹ thuật đã ghi rõ là không làm.
       */
      if (!centred.current || movesLen.current === 0) {
        centred.current = true;
        const cell = w <= MOBILE_MAX_WIDTH ? CELL_DEFAULT_MOBILE : CELL_DEFAULT_DESKTOP;
        setCam({ cell, ox: w / 2 - cell / 2, oy: h / 2 - cell / 2 });
      } else {
        setCam((current) => ({ ...current }));
      }
    };

    setPalette(readPalette(canvas));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  /*
   * Đọc lại palette khi giao diện đổi. Canvas đọc CSS custom property nên nó đi
   * theo `globals.css` miễn phí — nhưng nó KHÔNG tự biết lúc nào cần đọc lại, và
   * đó là cái bẫy: bảng màu của DOM đã đổi trong khi quân trên bàn thì chưa.
   *
   * HAI nguồn, cần cả hai (ADR-0026):
   * - `prefers-color-scheme` cho trạng thái `'system'`, khi người dùng đổi thiết
   *   lập hệ điều hành trong lúc trang đang mở;
   * - `data-theme` trên `<html>` cho lựa chọn tay. Thiếu cái này thì bấm Sáng/Tối
   *   trong cài đặt làm đổi cả trang TRỪ bàn cờ.
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const reread = () => setPalette(readPalette(canvas));

    const query =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    query?.addEventListener('change', reread);

    const observer =
      typeof MutationObserver === 'function' ? new MutationObserver(reread) : null;
    observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [THEME_ATTR],
    });

    return () => {
      query?.removeEventListener('change', reread);
      observer?.disconnect();
    };
  }, []);

  // Một khung một lần, khi có gì đổi. Không có vòng rAF chạy không tải: bàn chỉ đổi
  // khi có thao tác, nên giữa hai thao tác không có gì để vẽ lại.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null || palette == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(ctx, {
      cam,
      moves: args.moves,
      status: args.status,
      preview,
      previewSide: args.previewSide ?? 'one',
      cursor,
      w: canvas.width / dpr,
      h: canvas.height / dpr,
      palette,
      pieceSet: args.pieceSet ?? DEFAULT_PIECE_SET,
    });
  }, [
    cam,
    args.moves,
    args.status,
    args.pieceSet,
    args.previewSide,
    preview,
    cursor,
    palette,
  ]);

  // Ván mới thì con trỏ về `null`, để lần bấm phím sau lại bắt đầu từ ô (0,0). Giữ
  // con trỏ cũ nghĩa là nó trỏ vào một ô của ván đã biến mất.
  useEffect(() => {
    if (args.moves.length === 0) setCursor(null);
  }, [args.moves.length]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = localPoint(e);
    gesture.current = beginGesture(p.x, p.y);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const current = gesture.current;
    if (current === null) return;
    const p = localPoint(e);
    const dx = p.x - current.lastX;
    const dy = p.y - current.lastY;
    gesture.current = advanceGesture(current, p.x, p.y);
    setCam((cameraNow) => panBy(cameraNow, dx, dy));
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const current = gesture.current;
      gesture.current = null;
      if (current === null || isDrag(current)) return;
      if (args.status.kind !== 'playing') return;

      const p = localPoint(e);
      const at = screenToCell(cam, p.x, p.y);

      // ADR-0007: quyết theo con trỏ CỦA SỰ KIỆN, không theo khả năng thiết bị —
      // laptop màn cảm ứng là cả hai.
      if (e.pointerType === 'mouse') {
        setPreview(null);
        args.onPlace(at);
        return;
      }

      if (preview !== null && preview.x === at.x && preview.y === at.y) {
        setPreview(null);
        args.onPlace(at);
        return;
      }
      setPreview(at);
    },
    [args, cam, preview],
  );

  const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - box.left;
    const sy = e.clientY - box.top;
    const delta = e.deltaY < 0 ? WHEEL_STEP_PX : -WHEEL_STEP_PX;
    setCam((current) => zoomAt(current, sx, sy, clampCell(current.cell + delta)));
  }, []);

  /** Kích thước khung nhìn theo CSS px — `canvas.width` là pixel thiết bị. */
  const viewSize = useCallback(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    return { w: (canvas?.width ?? 0) / dpr, h: (canvas?.height ?? 0) / dpr };
  }, []);

  /**
   * Con trỏ bắt đầu ở NƯỚC CUỐI, không phải ở (0,0) giữa ván.
   * Đó là chỗ người chơi đang nghĩ; bắt họ bấm mũi tên từ gốc toạ độ về lại thế trận
   * là bắt họ đi lại quãng đường mà chính bàn vô hạn vừa tạo ra.
   */
  const startCell = useCallback((): Point => {
    const last = args.moves[args.moves.length - 1];
    return last?.at ?? { x: 0, y: 0 };
  }, [args.moves]);

  /**
   * Toàn bộ bàn phím của bàn cờ — ADR-0020.
   *
   * Mũi tên trần dịch CON TRỎ. `Shift` + mũi tên KÉO BÀN, và con trỏ đi theo bàn nên
   * nó đứng yên trên màn hình. Không có chế độ nào: một chế độ kéo-bàn riêng là trạng
   * thái ẩn, và trên bàn vô hạn thì không biết mình đang ở chế độ nào nghĩa là mỗi
   * phím mũi tên làm một trong hai việc hoàn toàn khác nhau.
   *
   * Chỉ `preventDefault` cho những phím hàm này THẬT SỰ xử lý. Chặn tất cả sẽ giết
   * `Tab`, và người dùng bàn phím mắc kẹt trong canvas — đúng cái mà FR-15 định sửa.
   */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      const dir = ARROWS[e.key];
      if (dir !== undefined) {
        e.preventDefault();
        const base = cursor ?? startCell();
        // Lần bấm đầu chỉ ĐẶT con trỏ, không dịch: nếu dịch luôn thì ô đầu tiên người
        // dùng nhìn thấy đã lệch một ô so với nước cuối, và không ai hiểu tại sao.
        const next = cursor === null ? base : { x: base.x + dir.x, y: base.y + dir.y };
        setCursor(next);
        const { w, h } = viewSize();
        if (e.shiftKey) {
          setCam((c) => panBy(c, -dir.x * c.cell, -dir.y * c.cell));
        } else {
          setCam((c) => ensureVisible(c, next, w, h));
        }
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (args.status.kind !== 'playing') return;
        const at = cursor ?? startCell();
        setCursor(at);
        setPreview(null);
        args.onPlace(at);
        return;
      }

      if (e.key === '+' || e.key === '=' || e.key === '-') {
        e.preventDefault();
        const { w, h } = viewSize();
        const delta = e.key === '-' ? -KEY_ZOOM_STEP_PX : KEY_ZOOM_STEP_PX;
        setCam((c) => zoomAt(c, w / 2, h / 2, clampCell(c.cell + delta)));
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        const { w, h } = viewSize();
        setCam(fitToMoves(args.moves, w, h));
      }
    },
    [args, cursor, startCell, viewSize],
  );

  const recenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const dpr = window.devicePixelRatio || 1;
    setCam(fitToMoves(args.moves, canvas.width / dpr, canvas.height / dpr));
    setPreview(null);
  }, [args.moves]);

  const confirmPreview = useCallback(() => {
    if (preview === null) return;
    const at = preview;
    setPreview(null);
    args.onPlace(at);
  }, [args, preview]);

  const showPreview = useCallback((at: Point) => setPreview(at), []);

  const clearPreview = useCallback(() => setPreview(null), []);

  return {
    canvasRef,
    cam,
    preview,
    cursor,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onKeyDown,
    recenter,
    confirmPreview,
    showPreview,
    clearPreview,
  };
}
