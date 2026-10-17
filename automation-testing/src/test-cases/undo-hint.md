# UNDOHINT — Test cases

Requirement: `docs/requirements/undo-hint.md` · quyết định: `docs/decisions/undo-hint.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-UNDOHINT-001 — Hoàn lấy lại cả nước của máy

- **Requirement:** REQ-UNDOHINT-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván đấu máy Dễ → 0, 0 → máy trả lời → 2, 2 → máy trả lời → Hoàn
- **Mong đợi:** còn 2 nước (nước đầu của người và câu trả lời đầu của máy); bấm Hoàn lần nữa → 0 nước
- **Automated:** `tests/e2e/undo-hint/undo.e2e.ts`

### TC-UNDOHINT-002 — máy đi trước, Hoàn còn mỗi nước của máy thì máy đánh lại, ván không đứng

- **Requirement:** REQ-UNDOHINT-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** ván Dễ, Máy đi trước → máy đánh 0, 0 → Hoàn
- **Mong đợi:** máy đánh lại 0, 0; người chơi đánh tiếp được (3 nước sau khi đánh 1, 1)
- **Automated:** `tests/e2e/undo-hint/undo.e2e.ts`

### TC-UNDOHINT-003 — Hoàn tắt khi ván chưa có nước nào

- **Requirement:** REQ-UNDOHINT-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** bắt đầu ván đấu máy, chưa đánh
- **Mong đợi:** Hoàn `disabled`; sau khi đánh một nước thì bật
- **Automated:** `tests/e2e/undo-hint/undo.e2e.ts`

### TC-UNDOHINT-004 — Gợi ý không thêm nước nào và hiện ô gợi ý cùng nút Đánh

- **Requirement:** REQ-UNDOHINT-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván Dễ → 0, 0 → máy trả lời → Gợi ý
- **Mong đợi:** thông báo "Gợi ý: đánh ở x, y."; vẫn 2 nước; nút "Đánh" hiện
- **Automated:** `tests/e2e/undo-hint/hint.e2e.ts`

### TC-UNDOHINT-005 — bấm Đánh đặt quân đúng ô gợi ý

- **Requirement:** REQ-UNDOHINT-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** như TC-UNDOHINT-004 → bấm Đánh
- **Mong đợi:** nước 3 nằm đúng ô gợi ý; nút Đánh biến mất; máy trả lời (4 nước)
- **Automated:** `tests/e2e/undo-hint/hint.e2e.ts`

### TC-UNDOHINT-006 — cùng thế cờ, gợi ý ở mức Dễ trùng gợi ý ở mức Khó

- **Requirement:** REQ-UNDOHINT-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 2
- **Bước:** chọn mức Dễ → Hai người → 4 nước định sẵn → Gợi ý; lặp lại với mức Khó
- **Mong đợi:** hai gợi ý cùng một ô
- **Automated:** `tests/e2e/undo-hint/hint.e2e.ts`

### TC-UNDOHINT-007 — gợi ý chỉ ra nước thắng ngay khi người chơi có

- **Requirement:** REQ-UNDOHINT-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** gieo ván Dễ: người có 0..3, 0 mở hai đầu, tới lượt người → Gợi ý
- **Mong đợi:** gợi ý là `4, 0` hoặc `−1, 0`
- **Automated:** `tests/e2e/undo-hint/hint.e2e.ts`

### TC-UNDOHINT-008 — Hoàn trong lúc máy đang nghĩ bỏ nước máy đang tính

- **Requirement:** REQ-UNDOHINT-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván Khó → 0, 0 → Hoàn ngay khi máy đang nghĩ → đánh 5, 5 → chờ máy trả lời
- **Mong đợi:** đúng 2 nước, nước đầu `5, 5`; không còn dấu vết của nước 0, 0 hay câu trả lời cho nó
- **Automated:** `tests/e2e/undo-hint/undo.e2e.ts`
