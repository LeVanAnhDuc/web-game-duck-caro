# SETTINGS — Test cases

Requirement: `docs/requirements/settings.md` · quyết định: `docs/decisions/settings.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-SETTINGS-001 — nút Cài đặt mở hộp thoại và Đóng đóng nó

- **Requirement:** REQ-SETTINGS-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** bấm Cài đặt ở header → bấm Đóng
- **Mong đợi:** hộp thoại "Cài đặt" hiện rồi biến mất
- **Automated:** `tests/e2e/settings/sheet.e2e.ts`

### TC-SETTINGS-002 — nút âm thanh ở header và ô trong Cài đặt luôn khớp nhau

- **Requirement:** REQ-SETTINGS-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** đọc nút header → bấm nó → mở Cài đặt → bỏ chọn / chọn ô âm thanh
- **Mong đợi:** mặc định nút ghi "Tắt âm thanh", `aria-pressed=true`; sau khi bấm ghi "Bật âm thanh", `false`, ô trong Cài đặt không chọn; tick lại ô thì nút header về "Tắt âm thanh"
- **Automated:** `tests/e2e/settings/sound.e2e.ts`

### TC-SETTINGS-003 — âm thanh bật: mỗi nước phát tiếng tổng hợp, nước người và máy khác cao độ, không file nào

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** theo dõi Web Audio + request → ván Dễ → 0, 0 → máy trả lời
- **Mong đợi:** 1 AudioContext; có oscillator cho nước người và cho nước máy với hai tần số khác nhau; 0 lần giải mã file; không request nào tới file âm thanh
- **Automated:** `tests/e2e/settings/sound.e2e.ts`

### TC-SETTINGS-004 — âm thanh tắt thì không phát gì

- **Requirement:** REQ-SETTINGS-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** theo dõi Web Audio → tắt âm thanh ở header → ván Dễ → 0, 0 → máy trả lời
- **Mong đợi:** không oscillator nào được tạo
- **Automated:** `tests/e2e/settings/sound.e2e.ts`

### TC-SETTINGS-005 — trình duyệt chặn âm thanh thì game im lặng và vẫn chơi được

- **Requirement:** REQ-SETTINGS-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `AudioContext` ném lỗi khi khởi tạo → ván Dễ → 0, 0 → 2, 2
- **Mong đợi:** 4 nước; không có lỗi trang
- **Automated:** `tests/e2e/settings/sound.e2e.ts`

### TC-SETTINGS-006 — mức khó mặc định điền sẵn màn bắt đầu, kể cả ván đầu sau khi tải trang

- **Requirement:** REQ-SETTINGS-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 4
- **Bước:** Cài đặt → Mức khó mặc định: Khó → đóng → tải lại → đọc màn bắt đầu → Bắt đầu
- **Mong đợi:** sau tải lại nhóm Mức khó chọn sẵn Khó; header của ván ghi "Khó"
- **Automated:** `tests/e2e/settings/defaults.e2e.ts`

### TC-SETTINGS-007 — luật mặc định điền sẵn màn bắt đầu

- **Requirement:** REQ-SETTINGS-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** Cài đặt → Luật mặc định: Tự do → đóng → tải lại
- **Mong đợi:** nhóm Luật thắng chọn sẵn Tự do, câu giải thích của Tự do
- **Automated:** `tests/e2e/settings/defaults.e2e.ts`

### TC-SETTINGS-008 — cài đặt sống qua tải lại và nằm ở khoá riêng của máy

- **Requirement:** REQ-SETTINGS-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** Cài đặt → Mức mặc định Khó, tắt âm thanh → đóng → tải lại → mở Cài đặt
- **Mong đợi:** có khoá `gomoku:v2:settings`; Khó vẫn `aria-pressed=true`, ô âm thanh không chọn
- **Automated:** `tests/e2e/settings/defaults.e2e.ts`

### TC-SETTINGS-009 — Xoá toàn bộ dữ liệu hỏi xác nhận và Thôi thì không xoá gì

- **Requirement:** REQ-SETTINGS-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván Dễ, đánh 1 nước → Cài đặt → Xoá toàn bộ dữ liệu → đọc câu cảnh báo → Thôi
- **Mong đợi:** câu "…không có bản sao nào — xoá là mất hẳn."; sau Thôi các khoá dữ liệu còn nguyên
- **Automated:** `tests/e2e/settings/clear-data.e2e.ts`

### TC-SETTINGS-010 — Xoá hẳn xoá ván đang dở, thống kê và cài đặt

- **Requirement:** REQ-SETTINGS-08
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** gieo thống kê và cài đặt → ván Dễ, đánh 1 nước → Cài đặt → Xoá toàn bộ dữ liệu → Xoá hẳn
- **Mong đợi:** không còn khoá `gomoku:` nào
- **Automated:** `tests/e2e/settings/clear-data.e2e.ts`

### TC-SETTINGS-011 — Cài đặt có mục Bàn phím dạy các phím của bàn

- **Requirement:** REQ-SETTINGS-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 1
- **Bước:** mở Cài đặt
- **Mong đợi:** dòng "Mũi tên dịch con trỏ · Enter đánh · Shift + mũi tên kéo bàn · + và − thu phóng · Home về giữa"
- **Automated:** `tests/e2e/settings/sheet.e2e.ts`

### TC-SETTINGS-012 — mọi điều khiển trong Cài đặt có nhãn đọc được

- **Requirement:** REQ-SETTINGS-10
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** mở Cài đặt → tìm ô theo nhãn "Âm thanh", tìm từng nhóm theo tên
- **Mong đợi:** ô âm thanh tìm được bằng nhãn; bốn nhóm Giao diện, Bộ quân, Mức khó mặc định, Luật mặc định đều có tên
- **Automated:** `tests/e2e/settings/sheet.e2e.ts`

### TC-SETTINGS-013 — cài đặt lưu bị hỏng thì về mặc định

- **Requirement:** REQ-SETTINGS-11
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** gieo cài đặt có `defaultLevel: "hard"` nhưng `pieceSet: "rainbow"` → mở game → mở Cài đặt
- **Mong đợi:** màn bắt đầu chọn Thường (mặc định, không phải Khó); Bộ quân chọn Bút chì; đúng một nút trong mỗi nhóm được chọn
- **Automated:** `tests/e2e/settings/defaults.e2e.ts`
