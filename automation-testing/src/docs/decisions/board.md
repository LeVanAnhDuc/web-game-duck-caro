# BOARD — Quyết định

Đi cặp với `docs/requirements/board.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-01, FR-02), `docs/01-product/journeys.md` (US-01 và "Điều gì có thể
  sai"), `docs/02-requirements/nfr.md` (NFR-REL-02, NFR-A11Y-03), `docs/03-design/invariants.md` (#2, #11),
  `docs/decisions/0002-…`, `0007-placement-interaction-depends-on-pointer-type.md`, `README.md` §Features "The board has
  no edges" + §Controls.
- **Code:** `client/src/hooks/useBoardCanvas.ts` (camera ban đầu, kéo, lăn, Giữa), `client/src/hooks/pointerGesture.ts`
  (`DRAG_THRESHOLD_PX = 10`), `client/src/game/render/camera.ts` (`CELL_MIN 16`, `CELL_MAX 64`, `CELL_DEFAULT_DESKTOP 32`,
  `fitToMoves`), `client/src/hooks/useGame.ts` (`cellOccupied`), `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `client/e2e/play.spec.ts` "đánh vào ô đã có quân thì bị từ chối" → TC-BOARD-008.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Bàn là `<canvas>`, kiểm vị trí quân thế nào? → Đọc toạ độ từ danh sách nước đi (DOM). Kéo / thu phóng chứng minh
  bằng hệ quả: sau khi kéo hoặc lăn, bấm một điểm màn hình cố định phải ra **ô khác** đúng như quãng kéo / mức phóng tính
  được. Không so ảnh.
- **Q2** Case cần thế cờ không bị máy chen vào thì chạy ở chế độ **Hai người**: hành vi bàn giống hệt hai chế độ.
- **Q3** US-01 bước 3 nói "nếu nước của máy nằm ngoài chỗ đang xem, bàn tự trượt tới". Code cố ý **không** dịch camera
  khi máy đánh (comment trong `useBoardCanvas.ts`: tự dịch là giật màn hình người đang đánh) và có nút Giữa thay thế.
  Hành vi đã ship và có lý do ghi trong code → coi là hành vi mong muốn; không viết case "bàn tự trượt".
- **Q4** Ngưỡng kéo 10px là quãng đi cộng dồn (`|dx| + |dy|`). Biên: 6px là bấm (đặt quân), 2 ô (64px) là kéo.

## Tài khoản test

Không có — game không có tài khoản.

## Ngoài phạm vi

- 60fps khi kéo / thu phóng (NFR-PERF-05): đo bằng Performance panel, không đo được ổn định trên CI.
- Bán kính bắt tâm ô rộng hơn ô (NFR-A11Y-03): unit test `client/src/game/render/camera.test.ts`.
- Kéo bằng ngón tay và tap hai lần: module `touch`.

## Tech debt liên quan

_(không có)_
