# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
TC-DUCKERID-001 chạy trên bản deploy (cờ tắt, project `app`); các case còn lại trên bản cờ bật (project `app-auth`).

### TC-DUCKERID-001 — cờ tắt: không nút, không sessionStorage, không request ra ngoài, URL có code bị bỏ mặc

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?code=x&state=y` trên bản cờ tắt
- **Mong đợi:** không nút "Đăng nhập" / "Tài khoản Ducker ID"; `ducker.pkce` không có; không request ra ngoài origin; URL vẫn còn `code=x`
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — đăng nhập: quay về đúng màn, URL sạch, nút tài khoản hiện chữ cái đầu

- **Requirement:** REQ-DUCKERID-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** issuer ok → Đăng nhập
- **Mong đợi:** nút "Tài khoản Ducker ID" hiện chữ "L"; URL không còn `code` / `state`; không lỗi hydration trong console
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-003 — menu tài khoản hiện tên, email, hồ sơ và Esc đóng menu trả focus

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** đăng nhập → mở menu → đọc → Esc
- **Mong đợi:** tên, email; "Mở hồ sơ Ducker ID" trỏ `http://ducker.test/profile`; sau Esc menu đóng, focus ở nút tài khoản
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — bấm ra ngoài hoặc Tab đóng menu tài khoản

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở menu → bấm vào tên app ở header (ngoài menu); mở lại → Tab
- **Mong đợi:** cả hai lần menu đóng
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — đăng xuất trả nút Đăng nhập và đặt focus vào nó

- **Requirement:** REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → menu → Đăng xuất
- **Mong đợi:** nút "Đăng nhập" hiện và có focus; không còn nút tài khoản
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — đã đăng nhập vẫn đánh với máy như thường

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** đăng nhập → ván Dễ → 0, 0
- **Mong đợi:** máy trả lời (2 nước); nút tài khoản vẫn còn
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — hồ sơ chỉ nằm trong bộ nhớ, tải lại là chưa đăng nhập

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** đăng nhập → đọc `localStorage` + `sessionStorage` → tải lại
- **Mong đợi:** không đâu chứa email hay tên; `ducker.pkce` không còn; sau tải lại nút "Đăng nhập"
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** issuer deny → Đăng nhập
- **Mong đợi:** nút "Đăng nhập"; URL không còn `error` / `state`; không nút tài khoản
- **Automated:** `tests/e2e/ducker-id/sign-in-failures.e2e.ts`

### TC-DUCKERID-009 — state bị sửa thì về chưa đăng nhập và không bao giờ gọi token

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** issuer tamper → Đăng nhập
- **Mong đợi:** nút "Đăng nhập"; URL sạch; số lần gọi token = 0
- **Automated:** `tests/e2e/ducker-id/sign-in-failures.e2e.ts`

### TC-DUCKERID-010 — Ducker ID treo thì sau tối đa 15 giây về chưa đăng nhập

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** issuer hang → Đăng nhập → chờ
- **Mong đợi:** token được gọi đúng 1 lần; trong 20 giây nút "Đăng nhập" (đúng tên) quay lại; URL sạch
- **Automated:** `tests/e2e/ducker-id/sign-in-failures.e2e.ts`

### TC-DUCKERID-011 — sessionStorage bị chặn thì bấm Đăng nhập không đưa đi đâu

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** `sessionStorage` ném lỗi → Đăng nhập
- **Mong đợi:** không request nào tới issuer; nút vẫn tên "Đăng nhập" và bấm được
- **Automated:** `tests/e2e/ducker-id/sign-in-failures.e2e.ts`

### TC-DUCKERID-012 — header 320–375px: nút ≥ 44px, không đè nhau, tên app một dòng, không cuộn ngang

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** với 375, 360, 320px: mở trang chưa đăng nhập → đo các nút header
- **Mong đợi:** mọi nút ≥ 44 × 44, không hai nút nào đè nhau; tên app cao < 28px; `scrollWidth` ≤ khổ màn
- **Automated:** `tests/e2e/ducker-id/header.e2e.ts`

### TC-DUCKERID-013 — menu tài khoản nằm trọn trong màn và không làm header nhảy

- **Requirement:** REQ-DUCKERID-10
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** với 320, 375, 768, 1440px: đăng nhập → đo header → mở menu → đo
- **Mong đợi:** menu trong khung nhìn (sheet `fixed` dưới 768, `absolute` từ 768); header không đổi vị trí, kích thước
- **Automated:** `tests/e2e/ducker-id/header.e2e.ts`
