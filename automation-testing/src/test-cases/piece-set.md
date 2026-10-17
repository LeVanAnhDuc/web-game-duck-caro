# PIECESET — Test cases

Requirement: `docs/requirements/piece-set.md` · quyết định: `docs/decisions/piece-set.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-PIECESET-001 — bốn bộ quân, mặc định Bút chì, mỗi ô vẽ hai hình khác nhau

- **Requirement:** REQ-PIECESET-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** mở Cài đặt → đọc nhóm Bộ quân
- **Mong đợi:** bốn nút Bút chì, Đặc/rỗng, Hình học, Vịt; Bút chì `aria-pressed=true`; mỗi nút có hai glyph với đường vẽ khác nhau; không hai bộ nào cùng hình
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`

### TC-PIECESET-002 — chọn bộ quân vẽ lại quân trên bàn ngay, chọn lại bộ cũ cho hình cũ

- **Requirement:** REQ-PIECESET-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** ván Hai người, 2 nước → dấu vân canvas → Cài đặt: Vịt → dấu vân → Bút chì → dấu vân
- **Mong đợi:** Vịt khác Bút chì; về Bút chì trùng ban đầu
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`

### TC-PIECESET-003 — bộ quân đã chọn sống qua tải lại

- **Requirement:** REQ-PIECESET-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Hai người, 1 nước → Cài đặt: Vịt → tải lại → mở Cài đặt
- **Mong đợi:** Vịt `aria-pressed=true`; ván vẫn 1 nước
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`

### TC-PIECESET-004 — đổi bộ quân không đổi ván

- **Requirement:** REQ-PIECESET-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Hai người, 3 nước → lần lượt chọn cả bốn bộ → đóng → đánh tiếp
- **Mong đợi:** danh sách nước không đổi, tới lượt Người 2; nước 4 được nhận
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`

### TC-PIECESET-005 — ở mọi bộ, quân của mỗi ghế giữ đúng màu của ghế

- **Requirement:** REQ-PIECESET-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** mở Cài đặt → đọc màu tính được của glyph ghế một và ghế hai ở cả bốn ô
- **Mong đợi:** bốn màu ghế một bằng nhau, bốn màu ghế hai bằng nhau, hai ghế khác màu
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`

### TC-PIECESET-006 — thanh hai ghế và màn bắt đầu vẽ quân bằng bộ đang chọn

- **Requirement:** REQ-PIECESET-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** Cài đặt: Hình học → đóng → đọc glyph ở nút Ai đi trước → bắt đầu ván → đọc glyph ở thanh hai ghế
- **Mong đợi:** đường vẽ glyph ghế một ở màn bắt đầu và ở thanh ghế trùng với glyph ghế một của ô Hình học
- **Automated:** `tests/e2e/piece-set/piece-set.e2e.ts`
