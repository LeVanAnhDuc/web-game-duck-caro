# OPPONENT — Test cases

Requirement: `docs/requirements/opponent.md` · quyết định: `docs/decisions/opponent.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-OPPONENT-001 — máy đáp lại nước của người chơi bằng Worker thật

- **Requirement:** REQ-OPPONENT-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ván đấu máy Dễ → đánh 0, 0
- **Mong đợi:** danh sách có 2 nước, nước đầu `0, 0`; thông báo "Máy đánh ở x, y. Lượt bạn." đúng toạ độ nước 2
- **Automated:** `tests/e2e/opponent/replies.e2e.ts`

### TC-OPPONENT-002 — chọn Máy đi trước thì máy tự đánh nước đầu ở 0, 0

- **Requirement:** REQ-OPPONENT-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** màn bắt đầu → Ai đi trước: Máy → Bắt đầu
- **Mong đợi:** không bấm gì, danh sách có 1 nước `0, 0`, thông báo "Máy đánh ở 0, 0. Lượt bạn."
- **Automated:** `tests/e2e/opponent/replies.e2e.ts`

### TC-OPPONENT-003 — mỗi mức khó: header ghi đúng mức và máy trả lời

- **Requirement:** REQ-OPPONENT-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** với từng mức Dễ / Thường / Khó: bắt đầu ván ở mức đó → đánh 0, 0
- **Mong đợi:** header ghi đúng tên mức; máy trả lời (2 nước) trong 15s
- **Automated:** `tests/e2e/opponent/replies.e2e.ts`

### TC-OPPONENT-004 — màn bắt đầu chọn sẵn mức Thường khi chưa cài đặt gì

- **Requirement:** REQ-OPPONENT-03
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** mở game với bộ nhớ trống → đọc nhóm Mức khó
- **Mong đợi:** "Thường" `aria-pressed=true`, hai mức kia `false`
- **Automated:** `tests/e2e/opponent/replies.e2e.ts`

### TC-OPPONENT-005 — trong lúc máy nghĩ, bấm thêm không đặt quân và Gợi ý tắt

- **Requirement:** REQ-OPPONENT-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** ván đấu máy Khó (máy nghĩ ~1s) → đánh 0, 0 → ngay lập tức bấm ô 2, 0
- **Mong đợi:** thanh ghế ghi "Máy đang nghĩ…", Gợi ý tắt; sau khi máy trả lời danh sách có đúng 2 nước, không có `2, 0`
- **Automated:** `tests/e2e/opponent/thinking.e2e.ts`

### TC-OPPONENT-006 — máy chặn ô duy nhất còn lại của đường bốn

- **Requirement:** REQ-OPPONENT-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** gieo ván Thường: người có 0..3, 0, máy đã chặn −1, 0, tới lượt máy → mở game
- **Mong đợi:** máy đánh ngay `4, 0`
- **Automated:** `tests/e2e/opponent/tactics.e2e.ts`

### TC-OPPONENT-007 — máy đi nước thắng khi có và ván kết thúc "Máy thắng"

- **Requirement:** REQ-OPPONENT-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** gieo ván Thường: máy có 0..3, 0 mở hai đầu, tới lượt người → người đánh xa (−6, 6)
- **Mong đợi:** máy đánh nước thứ năm trên hàng 0; kết quả "Máy thắng", "nước 10"
- **Automated:** `tests/e2e/opponent/tactics.e2e.ts`

### TC-OPPONENT-008 — máy không trả lời thì sau 5 giây hết "đang nghĩ" và có thông báo

- **Requirement:** REQ-OPPONENT-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** Worker giả không bao giờ trả lời, đồng hồ giả → ván Dễ → đánh 0, 0 → chạy đồng hồ 5s
- **Mong đợi:** trước 5s thanh ghế ghi "Máy đang nghĩ…"; sau 5s không còn, thông báo "Máy không trả lời kịp — thử đánh lại một nước"
- **Automated:** `tests/e2e/opponent/thinking.e2e.ts`

### TC-OPPONENT-009 — sau khi máy không trả lời kịp, người chơi vẫn đánh tiếp được

- **Requirement:** REQ-OPPONENT-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** như TC-OPPONENT-008 → bấm ô trống 2, 0
- **Mong đợi:** ván đi tiếp: danh sách có thêm ít nhất một nước
- **Automated:** `tests/e2e/opponent/thinking.e2e.ts`
