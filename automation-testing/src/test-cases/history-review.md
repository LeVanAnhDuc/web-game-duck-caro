# HISTORYREVIEW — Test cases

Requirement: `docs/requirements/history-review.md` · quyết định: `docs/decisions/history-review.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Ván chuẩn (decisions Q2): Hai người, 4 nước `0, 0` · `−1, 0` · `1, 1` · `−2, −3`, rồi Bỏ ván.

### TC-HISTORYREVIEW-001 — danh sách ghi từng nước với số thứ tự và toạ độ có dấu trừ thật

- **Requirement:** REQ-HISTORYREVIEW-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đánh 4 nước của ván chuẩn
- **Mong đợi:** 4 hàng, hàng i bắt đầu bằng số i; hàng 4 ghi `−2,  −3` (U+2212, căn phải)
- **Automated:** `tests/e2e/history-review/move-list.e2e.ts`

### TC-HISTORYREVIEW-002 — ván dài: nước mới nhất luôn hiện trong danh sách

- **Requirement:** REQ-HISTORYREVIEW-01
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** Hai người, đánh 40 nước rải rác (không ai thắng)
- **Mong đợi:** hàng 40 nằm trong khung nhìn; hàng 1 đã cuộn khỏi khung
- **Automated:** `tests/e2e/history-review/move-list.e2e.ts`

### TC-HISTORYREVIEW-003 — trong lúc chơi danh sách không bấm được và không có Xem lại

- **Requirement:** REQ-HISTORYREVIEW-02, REQ-HISTORYREVIEW-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đánh 4 nước của ván chuẩn, chưa kết thúc
- **Mong đợi:** không có nút nào trong danh sách; không có nút "Xem lại"
- **Automated:** `tests/e2e/history-review/move-list.e2e.ts`

### TC-HISTORYREVIEW-004 — Xem lại từ màn kết ván mở ở nước cuối

- **Requirement:** REQ-HISTORYREVIEW-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván chuẩn → Bỏ ván → Xem lại
- **Mong đợi:** "Đang xem lại", "4 / 4", 4 hàng bấm được
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-005 — bốn nút điều hướng đi đúng một nước và tắt ở hai biên

- **Requirement:** REQ-HISTORYREVIEW-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** vào xem lại → Nước trước → Về nước đầu → Nước sau → Tới nước cuối
- **Mong đợi:** ở 4/4 hai nút tới tắt; Nước trước → 3/4; Về nước đầu → 0/4, hai nút lùi tắt; Nước sau → 1/4; Tới nước cuối → 4/4
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-006 — bấm một hàng nhảy thẳng tới nước đó và chỉ một hàng được đánh dấu

- **Requirement:** REQ-HISTORYREVIEW-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** vào xem lại → bấm hàng 2
- **Mong đợi:** "2 / 4"; đúng một hàng `aria-current=true` và đó là hàng 2
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-007 — trong xem lại bấm lên bàn không tạo nước

- **Requirement:** REQ-HISTORYREVIEW-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** vào xem lại → về nước 2 → bấm vài ô trống trên bàn → thoát xem lại
- **Mong đợi:** vị trí vẫn "2 / 4"; sau khi thoát vẫn đúng 4 nước
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-008 — thoát xem lại về thế cuối và kết quả ván còn nguyên

- **Requirement:** REQ-HISTORYREVIEW-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** vào xem lại → về nước đầu → Thoát xem lại
- **Mong đợi:** không còn "Đang xem lại"; danh sách 4 nước; tiêu đề "Người 1 đã bỏ ván" vẫn hiện
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-009 — chế độ xem lại có nút Giữa

- **Requirement:** REQ-HISTORYREVIEW-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** vào xem lại
- **Mong đợi:** nút "Giữa" hiện trong cột phải
- **Automated:** `tests/e2e/history-review/review.e2e.ts`

### TC-HISTORYREVIEW-010 — bàn vẽ đúng thế trận tại nước đang xem

- **Requirement:** REQ-HISTORYREVIEW-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** vào xem lại → hash canvas ở 4/4 → Nước trước (3/4) → hash → Tới nước cuối → bấm hàng 3 → hash
- **Mong đợi:** hash 3/4 ≠ hash 4/4; hash 3/4 qua nút lùi = hash 3/4 qua hàng danh sách
- **Automated:** `tests/e2e/history-review/review.e2e.ts`
