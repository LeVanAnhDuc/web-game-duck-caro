# RESPONSIVE — Test cases

Requirement: `docs/requirements/responsive.md` · quyết định: `docs/decisions/responsive.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-RESPONSIVE-001 — không cuộn ngang ở mọi khổ từ 320 đến 1440px

- **Requirement:** REQ-RESPONSIVE-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** với từng khổ 320, 375, 768, 1024, 1440: mở game, đo; bắt đầu ván, đánh một nước, đo lại
- **Mong đợi:** `scrollWidth` của trang không lớn hơn chiều rộng cửa sổ
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-002 — từ 1024px có cột phải và không có thanh nút đáy

- **Requirement:** REQ-RESPONSIVE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** khổ 1024 → bắt đầu ván
- **Mong đợi:** cột phải hiện (Nước đi, Thành tích, bốn nút); thanh nút đáy ẩn
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-003 — ở 375px không có cột phải, có thanh nút đáy và chơi được

- **Requirement:** REQ-RESPONSIVE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** khổ 375 → ván Hai người → bấm ô 1, 0 → bấm Hoàn ở thanh đáy
- **Mong đợi:** cột phải ẩn; thanh đáy có Hoàn, Gợi ý, Giữa, Bỏ ván; dòng thông báo "Người 1 đánh ở 1, 0."; sau Hoàn "nước 0"
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-004 — trên thanh nút hẹp, Bỏ ván chỉ còn icon nhưng vẫn có tên và 44px

- **Requirement:** REQ-RESPONSIVE-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Bước:** khổ 375 → bắt đầu ván → đo nút Bỏ ván ở thanh đáy
- **Mong đợi:** tên "Bỏ ván", không có chữ hiện ra, rộng và cao ≥ 44px
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-005 — Cài đặt là sheet đáy ở 375px và cột phải ở 1280px

- **Requirement:** REQ-RESPONSIVE-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** khổ 375 → mở Cài đặt → đo; khổ 1280 → mở Cài đặt → đo
- **Mong đợi:** 375: rộng bằng màn, mép dưới sát đáy khung bàn; 1280: mép phải sát cửa sổ, rộng 320px, cao hết cửa sổ
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-006 — ở 375px kết ván là sheet có Chơi lại và Xem lại, xem lại là sheet đáy

- **Requirement:** REQ-RESPONSIVE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** khổ 375 → ván Hai người → 2 nước → Bỏ ván → Xem lại → Nước trước
- **Mong đợi:** "Người 1 đã bỏ ván" với Chơi lại, Xem lại; trong xem lại thấy "Đang xem lại", "2 / 2" rồi "1 / 2"
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`

### TC-RESPONSIVE-007 — ô mở với 28px khi canvas ≤ 640px và 32px khi rộng hơn

- **Requirement:** REQ-RESPONSIVE-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** khổ 375 → ván Hai người → bấm cách tâm 28px; khổ 768 → ván Hai người → bấm cách tâm 32px
- **Mong đợi:** cả hai ra nước ở ô `1, 0`
- **Automated:** `tests/e2e/responsive/layout.e2e.ts`
