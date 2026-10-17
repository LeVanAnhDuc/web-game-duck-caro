# PERSISTENCE — Test cases

Requirement: `docs/requirements/persistence.md` · quyết định: `docs/decisions/persistence.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-PERSISTENCE-001 — ván dở sống qua một lần tải lại trang thật

- **Requirement:** REQ-PERSISTENCE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván Dễ → 0, 0 → máy trả lời → 1, 0 → máy trả lời → tải lại
- **Mong đợi:** không có màn bắt đầu; danh sách nước y hệt trước khi tải; header "Dễ"; đánh tiếp được và máy trả lời
- **Automated:** `tests/e2e/persistence/resume.e2e.ts`

### TC-PERSISTENCE-002 — tải lại đúng lúc máy đang nghĩ thì máy đánh ngay khi mở lại

- **Requirement:** REQ-PERSISTENCE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Khó → 0, 0 → tải lại ngay khi thanh ghế ghi "Máy đang nghĩ…"
- **Mong đợi:** sau tải lại ván có nước 0, 0 và máy tự trả lời (2 nước), tới lượt Bạn
- **Automated:** `tests/e2e/persistence/resume.e2e.ts`

### TC-PERSISTENCE-003 — ván đã kết thúc không còn gì để tiếp tục sau tải lại

- **Requirement:** REQ-PERSISTENCE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Dễ → 0, 0 → Bỏ ván → tải lại
- **Mong đợi:** màn bắt đầu hiện, không còn ván cũ
- **Automated:** `tests/e2e/persistence/resume.e2e.ts`

### TC-PERSISTENCE-004 — Chơi lại xoá ván cũ khỏi bộ nhớ

- **Requirement:** REQ-PERSISTENCE-04
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** ván Dễ → 0, 0 → Bỏ ván → Chơi lại → tải lại
- **Mong đợi:** màn bắt đầu; khoá ván đang dở không còn trong bộ nhớ
- **Automated:** `tests/e2e/persistence/resume.e2e.ts`

### TC-PERSISTENCE-005 — localStorage bị chặn thì vẫn chơi được, quên ván và không báo lỗi

- **Requirement:** REQ-PERSISTENCE-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** `localStorage` ném lỗi ở mọi lối vào → mở game → ván Dễ → 0, 0 → tải lại
- **Mong đợi:** máy trả lời (2 nước); sau tải lại về màn bắt đầu; không có lỗi trang nào
- **Automated:** `tests/e2e/persistence/broken-storage.e2e.ts`

### TC-PERSISTENCE-006 — ván lưu bị hỏng thì bị bỏ và vào màn bắt đầu

- **Requirement:** REQ-PERSISTENCE-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** gieo khoá ván đang dở = chuỗi không phải JSON → mở game
- **Mong đợi:** màn bắt đầu; bắt đầu ván mới chơi được; không có lỗi trang
- **Automated:** `tests/e2e/persistence/broken-storage.e2e.ts`

### TC-PERSISTENCE-007 — ván lưu theo định dạng cũ (v1) bị bỏ, không vỡ

- **Requirement:** REQ-PERSISTENCE-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** gieo khoá ván đang dở với nước có `side: "human"` / `"ai"` (định dạng v1) → mở game
- **Mong đợi:** màn bắt đầu; không có lỗi trang
- **Automated:** `tests/e2e/persistence/broken-storage.e2e.ts`

### TC-PERSISTENCE-008 — bộ nhớ đầy thì vẫn chơi được và máy vẫn trả lời

- **Requirement:** REQ-PERSISTENCE-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** mọi lần ghi `localStorage` ném `QuotaExceededError` → ván Dễ → 0, 0 → 2, 2
- **Mong đợi:** 4 nước, không có lỗi trang
- **Automated:** `tests/e2e/persistence/broken-storage.e2e.ts`
