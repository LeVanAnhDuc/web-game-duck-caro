# HOTSEAT — Test cases

Requirement: `docs/requirements/hotseat.md` · quyết định: `docs/decisions/hotseat.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-HOTSEAT-001 — chọn Hai người ẩn mức khó, đổi tên ghế và header ghi Hai người

- **Requirement:** REQ-HOTSEAT-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** màn bắt đầu → Chế độ: Hai người → đọc màn → Bắt đầu
- **Mong đợi:** không còn nhóm Mức khó; hai nút Ai đi trước là "Người 1", "Người 2"; header ghi "Hai người"; chọn lại Đấu máy thì nhóm Mức khó và "Bạn", "Máy" quay lại
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`

### TC-HOTSEAT-002 — hai người đánh luân phiên và máy không được hỏi nước nào

- **Requirement:** REQ-HOTSEAT-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** đếm thông điệp gửi Worker → ván Hai người → Người 1 đánh 0, 0 → Người 2 đánh 1, 0 → Người 1 đánh 2, 2
- **Mong đợi:** đúng 3 nước, xen kẽ hai ghế; số thông điệp gửi Worker = 0
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`

### TC-HOTSEAT-003 — thanh hai ghế làm nổi ghế đang tới lượt và đổi sau mỗi nước

- **Requirement:** REQ-HOTSEAT-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** ván Hai người → đọc thanh ghế → Người 1 đánh → đọc lại → Người 2 đánh → đọc lại
- **Mong đợi:** lúc đầu Người 1 đậm, Người 2 thường; sau nước 1 đảo lại và thông báo "Người 1 đánh ở 0, 0."; sau nước 2 về như đầu
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`

### TC-HOTSEAT-004 — hoàn nước lùi đúng một nước

- **Requirement:** REQ-HOTSEAT-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 5
- **Bước:** ván Hai người → 0, 0 rồi 1, 0 → Hoàn
- **Mong đợi:** còn 1 nước `0, 0`; tới lượt Người 2 lại
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`

### TC-HOTSEAT-005 — Người 2 thắng thì màn kết ván gọi tên Người 2

- **Requirement:** REQ-HOTSEAT-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** ván Hai người → Người 1 đánh rải rác, Người 2 đánh 0..4, 5
- **Mong đợi:** "Người 2 thắng", không có chữ "Bạn" hay "Máy" trong kết quả
- **Automated:** `tests/e2e/hotseat/end.e2e.ts`

### TC-HOTSEAT-006 — Bỏ ván do ghế đang tới lượt bỏ

- **Requirement:** REQ-HOTSEAT-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Hai người → Người 1 đánh 0, 0 (tới lượt Người 2) → Bỏ ván
- **Mong đợi:** "Người 2 đã bỏ ván"
- **Automated:** `tests/e2e/hotseat/end.e2e.ts`

### TC-HOTSEAT-007 — ván hai người không vào thống kê và không hiện bảng Thành tích

- **Requirement:** REQ-HOTSEAT-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** ván Hai người → đánh 1 nước → Bỏ ván → Chơi lại → chọn Đấu máy
- **Mong đợi:** trong ván không có bảng Thành tích; sau đó không có khoá thống kê nào ghi kết quả, bảng của ván đấu máy ghi "chưa chơi" cả ba mức
- **Automated:** `tests/e2e/hotseat/end.e2e.ts`

### TC-HOTSEAT-008 — Người 2 đi trước thì nước đầu thuộc Người 2

- **Requirement:** REQ-HOTSEAT-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** màn bắt đầu → Hai người → Ai đi trước: Người 2 → Bắt đầu → đánh 0, 0
- **Mong đợi:** trước nước đầu Người 2 đậm; thông báo "Người 2 đánh ở 0, 0."; sau đó tới lượt Người 1
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`

### TC-HOTSEAT-009 — tải lại giữa ván hai người tiếp tục đúng chế độ, đúng lượt, không hỏi máy

- **Requirement:** REQ-HOTSEAT-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đếm thông điệp gửi Worker → ván Hai người → 3 nước → tải lại → đánh nước thứ 4
- **Mong đợi:** sau tải lại 3 nước, header "Hai người", Người 2 đậm; nước 4 thành của Người 2; số thông điệp gửi Worker = 0
- **Automated:** `tests/e2e/hotseat/turns.e2e.ts`
