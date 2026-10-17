# BOARD — Test cases

Requirement: `docs/requirements/board.md` · quyết định: `docs/decisions/board.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-BOARD-001 — ván mới mở với bàn trống và nước đầu ở giữa khung nhìn là ô 0, 0

- **Requirement:** REQ-BOARD-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở game → bắt đầu ván Hai người → đọc dòng thông báo → bấm vào tâm canvas
- **Mong đợi:** danh sách nước trống, thông báo "Kéo để di chuyển bàn · lăn chuột để thu phóng"; sau cú bấm danh sách có đúng một nước `0, 0`
- **Automated:** `tests/e2e/board/placement.e2e.ts`

### TC-BOARD-002 — bấm chuột đặt quân đúng ô dưới con trỏ, kể cả toạ độ âm

- **Requirement:** REQ-BOARD-02, REQ-BOARD-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** ván Hai người → bấm ô (3, 1) → bấm ô (−2, −3)
- **Mong đợi:** danh sách ghi `3, 1` rồi `−2, −3` (dấu trừ U+2212), đúng thứ tự
- **Automated:** `tests/e2e/board/placement.e2e.ts`

### TC-BOARD-003 — kéo bàn hai ô sang phải không đặt quân và dời bàn đúng hai ô

- **Requirement:** REQ-BOARD-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván Hai người → kéo chuột 64px sang phải → bấm vào tâm canvas
- **Mong đợi:** cú kéo không thêm nước nào; cú bấm sau đó ra ô `−2, 0`
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-004 — rung tay 6px khi bấm vẫn là một cú bấm, không phải kéo

- **Requirement:** REQ-BOARD-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** ván Hai người → nhấn chuột ở tâm, di 6px, thả
- **Mong đợi:** một nước được đặt (dưới ngưỡng 10px là bấm)
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-005 — lăn chuột phóng to neo tại con trỏ

- **Requirement:** REQ-BOARD-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** ván Hai người → lăn lên 5 nấc ở tâm (32 → 42px) → bấm cách tâm 84px sang phải
- **Mong đợi:** nước ra ô `2, 0` (ô 0, 0 vẫn ở tâm, cạnh ô 42px)
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-006 — thu phóng dừng ở 64px khi phóng to và 16px khi thu nhỏ

- **Requirement:** REQ-BOARD-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** ván Hai người → lăn lên 30 nấc → bấm cách tâm 64px; ván mới → lăn xuống 30 nấc → bấm cách tâm 48px
- **Mong đợi:** lần đầu ra ô `1, 0` (64px/ô), lần sau ra ô `3, 0` (16px/ô)
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-007 — nút Giữa đưa quân đã đánh trở lại khung nhìn sau khi kéo đi xa

- **Requirement:** REQ-BOARD-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Hai người → đánh ô 0, 0 → kéo bàn đi 10 ô → bấm Giữa → bấm vào tâm canvas
- **Mong đợi:** cú bấm vào tâm bị từ chối "Ô đó đã có quân" — quân ở 0, 0 đã về giữa khung nhìn
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-008 — đánh vào ô đã có quân bị từ chối và có thông báo

- **Requirement:** REQ-BOARD-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** ván đấu máy Dễ → đánh 0, 0 → chờ máy trả lời → bấm lại 0, 0
- **Mong đợi:** thông báo "Ô đó đã có quân"; danh sách vẫn 2 nước
- **Automated:** `tests/e2e/board/placement.e2e.ts`

### TC-BOARD-009 — kéo bàn ra xa 40 ô vẫn đánh được, toạ độ tiếp tục đếm

- **Requirement:** REQ-BOARD-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** ván Hai người → kéo bàn 4 lần, mỗi lần 10 ô sang phải → bấm tâm canvas
- **Mong đợi:** nước ra ô `−40, 0`
- **Automated:** `tests/e2e/board/pan-zoom.e2e.ts`

### TC-BOARD-010 — bấm đúp thật nhanh vào một ô chỉ tạo một nước

- **Requirement:** REQ-BOARD-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván đấu máy Dễ → bấm đúp vào ô 3, 3 → chờ máy trả lời
- **Mong đợi:** đúng 2 nước: `3, 3` của người và một nước của máy — không có nước thứ hai của người
- **Automated:** `tests/e2e/board/placement.e2e.ts`
