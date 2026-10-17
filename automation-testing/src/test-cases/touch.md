# TOUCH — Test cases

Requirement: `docs/requirements/touch.md` · quyết định: `docs/decisions/touch.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Project `app-touch` (Pixel 5), chế độ Hai người, ô 28px.

### TC-TOUCH-001 — chạm một ô chỉ hiện quân xem trước và nút Đánh

- **Requirement:** REQ-TOUCH-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** chạm ô 1, 0
- **Mong đợi:** nút "Đánh" hiện; vẫn "nước 0"
- **Automated:** `tests/e2e/touch/tap.e2e.ts`

### TC-TOUCH-002 — chạm lại đúng ô đang xem trước thì thành nước thật

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** chạm ô 1, 0 → chạm lại ô 1, 0
- **Mong đợi:** "nước 1", thông báo "Người 1 đánh ở 1, 0."; nút Đánh biến mất
- **Automated:** `tests/e2e/touch/tap.e2e.ts`

### TC-TOUCH-003 — bấm Đánh đặt quân ở ô đang xem trước

- **Requirement:** REQ-TOUCH-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** chạm ô −2, 1 → bấm Đánh
- **Mong đợi:** "nước 1", thông báo "Người 1 đánh ở -2, 1."
- **Automated:** `tests/e2e/touch/tap.e2e.ts`

### TC-TOUCH-004 — chạm sang ô khác dời quân xem trước, không đánh

- **Requirement:** REQ-TOUCH-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** chạm ô 1, 0 → chạm ô 2, 2 → chạm lại ô 2, 2
- **Mong đợi:** sau cú chạm thứ hai vẫn "nước 0" và nút Đánh còn; cú thứ ba đánh ở `2, 2`, không ở `1, 0`
- **Automated:** `tests/e2e/touch/tap.e2e.ts`

### TC-TOUCH-005 — ngón tay kéo đi rồi quay về là kéo, không phải chạm

- **Requirement:** REQ-TOUCH-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** chạm xuống ô 0, 0 → kéo 40px sang phải → quay về đúng chỗ cũ → nhấc tay
- **Mong đợi:** không nút Đánh, "nước 0"
- **Automated:** `tests/e2e/touch/drag.e2e.ts`

### TC-TOUCH-006 — rung tay 4px khi chạm vẫn là chạm

- **Requirement:** REQ-TOUCH-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** chạm xuống ô 0, 0 → dịch 4px → nhấc tay
- **Mong đợi:** nút Đánh hiện (xem trước), "nước 0"
- **Automated:** `tests/e2e/touch/drag.e2e.ts`
