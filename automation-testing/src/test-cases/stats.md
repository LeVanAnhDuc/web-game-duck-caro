# STATS — Test cases

Requirement: `docs/requirements/stats.md` · quyết định: `docs/decisions/stats.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-STATS-001 — Bỏ ván kết thúc ván và cộng một lần bỏ ở đúng mức

- **Requirement:** REQ-STATS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván Dễ → 0, 0 → máy trả lời → Bỏ ván
- **Mong đợi:** "Bạn đã bỏ ván"; hàng Dễ "0 thắng · 0 thua · 1 bỏ"
- **Automated:** `tests/e2e/stats/results.e2e.ts`

### TC-STATS-002 — thắng máy cộng một lần thắng ở đúng mức

- **Requirement:** REQ-STATS-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** gieo ván Dễ: người có 0..3, 0 mở, tới lượt người → đánh 4, 0
- **Mong đợi:** "Bạn thắng"; hàng Dễ "1 thắng · 0 thua · 0 bỏ"
- **Automated:** `tests/e2e/stats/results.e2e.ts`

### TC-STATS-003 — thua máy cộng một lần thua ở đúng mức

- **Requirement:** REQ-STATS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** gieo ván Thường: máy có 0..3, 0 mở, tới lượt người → đánh xa
- **Mong đợi:** "Máy thắng"; hàng Thường "0 thắng · 1 thua · 0 bỏ"
- **Automated:** `tests/e2e/stats/results.e2e.ts`

### TC-STATS-004 — một ván chỉ được đếm một lần dù đổi kích thước hay tải lại

- **Requirement:** REQ-STATS-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván Dễ → bỏ ván → đổi khung nhìn 1100 → 1280 → 1180 → tải lại → bắt đầu ván mới ở Dễ
- **Mong đợi:** hàng Dễ vẫn "1 bỏ", không bao giờ "2 bỏ"
- **Automated:** `tests/e2e/stats/results.e2e.ts`

### TC-STATS-005 — thành tích tách theo mức và bảng làm nổi mức đang chơi

- **Requirement:** REQ-STATS-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** ván Thường → bỏ ván → đọc bảng
- **Mong đợi:** Thường "0 thắng · 0 thua · 1 bỏ"; Dễ và Khó "chưa chơi"; nhãn Thường đậm hơn hai nhãn kia
- **Automated:** `tests/e2e/stats/results.e2e.ts`

### TC-STATS-006 — màn bắt đầu hiện dòng thành tích của mức đang chọn

- **Requirement:** REQ-STATS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** gieo thống kê Dễ 2 thắng · 1 thua · 0 bỏ → mở game → chọn Dễ → chọn Khó
- **Mong đợi:** ở Dễ có dòng "2 thắng · 1 thua · 0 bỏ"; ở Khó (chưa có ván) không có dòng nào
- **Automated:** `tests/e2e/stats/start-line.e2e.ts`

### TC-STATS-007 — thành tích sống qua tải lại trang

- **Requirement:** REQ-STATS-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Khó → 0, 0 → bỏ ván → Chơi lại → tải lại → chọn Khó
- **Mong đợi:** màn bắt đầu có dòng "0 thắng · 0 thua · 1 bỏ"
- **Automated:** `tests/e2e/stats/start-line.e2e.ts`

### TC-STATS-008 — bỏ ván trong lúc máy đang nghĩ thì người chơi là bên bỏ

- **Requirement:** REQ-STATS-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván Khó → 0, 0 → Bỏ ván ngay khi máy đang nghĩ
- **Mong đợi:** "Bạn đã bỏ ván" (không phải "Máy đã bỏ ván"); hàng Khó "0 thắng · 0 thua · 1 bỏ"
- **Automated:** `tests/e2e/stats/results.e2e.ts`
