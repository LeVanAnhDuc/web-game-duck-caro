# PRIVACY — Test cases

Requirement: `docs/requirements/privacy.md` · quyết định: `docs/decisions/privacy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
"Một ván đầy đủ": ván Dễ → 0, 0 → máy trả lời → Gợi ý → Đánh theo gợi ý → máy trả lời → Bỏ ván → Xem lại → Về nước đầu.

### TC-PRIVACY-001 — một ván đầy đủ không gửi request nào ra ngoài origin

- **Requirement:** REQ-PRIVACY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** ghi mọi request từ lúc mở trang → chơi một ván đầy đủ
- **Mong đợi:** mọi request cùng origin với trang
- **Automated:** `tests/e2e/privacy/no-leaks.e2e.ts`

### TC-PRIVACY-002 — trang không đặt cookie nào

- **Requirement:** REQ-PRIVACY-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** chơi một ván đầy đủ → đọc cookie của context
- **Mong đợi:** không có cookie
- **Automated:** `tests/e2e/privacy/no-leaks.e2e.ts`

### TC-PRIVACY-003 — bộ nhớ trình duyệt chỉ chứa khoá của game

- **Requirement:** REQ-PRIVACY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** chơi một ván đầy đủ, đổi một cài đặt → đọc `localStorage` và `sessionStorage`
- **Mong đợi:** `localStorage` chỉ có khoá bắt đầu bằng `gomoku:` (thống kê, cài đặt; ván đã kết thúc không còn); `sessionStorage` trống
- **Automated:** `tests/e2e/privacy/no-leaks.e2e.ts`

### TC-PRIVACY-004 — mất mạng sau khi tải xong vẫn chơi tiếp, máy và gợi ý vẫn chạy

- **Requirement:** REQ-PRIVACY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở trang, chờ mạng yên → ngắt mạng → ván Dễ → 0, 0 → 2, 2 → Gợi ý
- **Mong đợi:** máy trả lời cả hai nước (4 nước); gợi ý hiện "Gợi ý: đánh ở …"
- **Automated:** `tests/e2e/privacy/offline.e2e.ts`

### TC-PRIVACY-005 — một ván đầy đủ không có lỗi console hay lỗi trang

- **Requirement:** REQ-PRIVACY-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** ghi `console.error` và `pageerror` → chơi một ván đầy đủ
- **Mong đợi:** không có dòng nào
- **Automated:** `tests/e2e/privacy/no-leaks.e2e.ts`
