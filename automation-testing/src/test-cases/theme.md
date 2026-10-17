# THEME — Test cases

Requirement: `docs/requirements/theme.md` · quyết định: `docs/decisions/theme.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Màu tham chiếu (decisions Q1): `--paper` sáng `#f7f3e8`, tối `#191c20`.

### TC-THEME-001 — mặc định Theo máy: giao diện theo hệ điều hành và đổi ngay khi hệ đổi

- **Requirement:** REQ-THEME-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** hệ sáng → mở game → Cài đặt → đọc nhóm Giao diện → đổi hệ sang tối → đổi lại sáng
- **Mong đợi:** "Theo máy" được chọn, không có `data-theme`; `--paper` đi theo hệ ở mỗi lần đổi
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-002 — chọn Tối hoặc Sáng áp ngay và thắng hệ điều hành theo cả hai chiều

- **Requirement:** REQ-THEME-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** hệ sáng → chọn Tối; hệ tối → chọn Sáng
- **Mong đợi:** lần đầu `--paper` tối dù hệ sáng; lần sau sáng dù hệ tối; nút vừa chọn `aria-pressed=true`
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-003 — lựa chọn giao diện sống qua tải lại

- **Requirement:** REQ-THEME-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** hệ sáng → chọn Tối → tải lại → mở Cài đặt
- **Mong đợi:** vẫn tối; "Tối" vẫn được chọn
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-004 — trang tải lại đã ở giao diện tối ngay từ khung hình đầu

- **Requirement:** REQ-THEME-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** hệ sáng → chọn Tối → ghi `data-theme` và `--paper` ở khung hình đầu → tải lại
- **Mong đợi:** ở khung hình đầu `data-theme="dark"` và `--paper` = `#191c20`
- **Automated:** `tests/e2e/theme/first-paint.e2e.ts`

### TC-THEME-005 — bàn vẽ lại bằng bảng màu mới ngay khi chọn giao diện

- **Requirement:** REQ-THEME-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** hệ sáng → ván Hai người → đọc điểm ảnh tâm ô trống 3, 3 → chọn Tối → đọc lại
- **Mong đợi:** điểm ảnh từ nền giấy sáng thành nền tối (độ sáng giảm rõ rệt)
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-006 — ở Theo máy, hệ đổi sang tối thì bàn vẽ lại tối

- **Requirement:** REQ-THEME-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** hệ sáng, Theo máy → ván Hai người → đọc điểm ảnh → đổi hệ sang tối → đọc lại
- **Mong đợi:** điểm ảnh nền thành tối
- **Automated:** `tests/e2e/theme/theme.e2e.ts`

### TC-THEME-007 — đổi giao diện giữa ván không ảnh hưởng ván

- **Requirement:** REQ-THEME-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** ván Hai người, 3 nước → Cài đặt → Tối → Đóng → đánh tiếp
- **Mong đợi:** vẫn 3 nước như cũ, tới lượt Người 2; nước 4 được nhận
- **Automated:** `tests/e2e/theme/theme.e2e.ts`
