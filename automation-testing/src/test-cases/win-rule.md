# WINRULE — Test cases

Requirement: `docs/requirements/win-rule.md` · quyết định: `docs/decisions/win-rule.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Mọi case chạy ở chế độ Hai người (decisions Q1): Người 1 đi trước, hai ghế đánh luân phiên.

### TC-WINRULE-001 — năm quân ngang không bị chặn thắng và màn kết ván gọi tên ghế

- **Requirement:** REQ-WINRULE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Caro Việt → Người 1 đánh 0..4, 0; Người 2 đánh xa ở hàng 5
- **Mong đợi:** "Người 1 thắng", "nước 9", thông báo "Người 1 đánh ở 4, 0 và thắng."
- **Automated:** `tests/e2e/win-rule/five.e2e.ts`

### TC-WINRULE-002 — năm quân thắng theo dọc và hai đường chéo

- **Requirement:** REQ-WINRULE-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** ba ván, mỗi ván Người 1 đánh năm ô theo một hướng: dọc (0, 0..4), chéo xuống (i, i), chéo lên (i, −i)
- **Mong đợi:** cả ba ván kết thúc "Người 1 thắng" ở nước 9
- **Automated:** `tests/e2e/win-rule/five.e2e.ts`

### TC-WINRULE-003 — bốn quân liền chưa thắng và ván đi tiếp

- **Requirement:** REQ-WINRULE-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** Người 1 đánh 0..3, 0; Người 2 đánh xa
- **Mong đợi:** không có kết quả; Người 2 vẫn đánh được nước thứ 8
- **Automated:** `tests/e2e/win-rule/five.e2e.ts`

### TC-WINRULE-004 — luật Caro Việt: năm quân bị chặn hai đầu không thắng

- **Requirement:** REQ-WINRULE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Caro Việt → Người 2 chặn −1, 0 và 5, 0; Người 1 đánh 0..4, 0
- **Mong đợi:** 9 nước, không ai thắng, nước thứ 10 vẫn đánh được
- **Automated:** `tests/e2e/win-rule/blocked-ends.e2e.ts`

### TC-WINRULE-005 — luật Caro Việt: sáu quân bị chặn hai đầu cũng không thắng

- **Requirement:** REQ-WINRULE-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** Caro Việt → Người 2 chặn −1, 0 và 6, 0; Người 1 đánh 0..3, 5 rồi lấp 4, 0
- **Mong đợi:** 11 nước, không ai thắng (đoạn cực đại 6 quân, chặn hai đầu — bất biến 3)
- **Automated:** `tests/e2e/win-rule/blocked-ends.e2e.ts`

### TC-WINRULE-006 — luật Caro Việt: năm quân bị chặn một đầu vẫn thắng

- **Requirement:** REQ-WINRULE-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** Caro Việt → Người 2 chặn −1, 0; Người 1 đánh 0..4, 0
- **Mong đợi:** "Người 1 thắng"
- **Automated:** `tests/e2e/win-rule/blocked-ends.e2e.ts`

### TC-WINRULE-007 — luật Tự do: năm quân bị chặn hai đầu vẫn thắng

- **Requirement:** REQ-WINRULE-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 2
- **Bước:** Tự do → cùng thế với TC-WINRULE-004
- **Mong đợi:** "Người 1 thắng"
- **Automated:** `tests/e2e/win-rule/blocked-ends.e2e.ts`

### TC-WINRULE-008 — sáu quân liền không bị chặn vẫn thắng

- **Requirement:** REQ-WINRULE-06
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** Caro Việt → Người 1 đánh 0..3, 0 và 5, 0 rồi lấp 4, 0
- **Mong đợi:** "Người 1 thắng" ở nước lấp 4, 0
- **Automated:** `tests/e2e/win-rule/five.e2e.ts`

### TC-WINRULE-009 — màn bắt đầu chọn sẵn Caro Việt và câu giải thích đổi theo luật

- **Requirement:** REQ-WINRULE-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** mở game với bộ nhớ trống → đọc nhóm Luật thắng → chọn Tự do → chọn lại Caro Việt
- **Mong đợi:** mặc định Caro Việt `aria-pressed=true` với câu "…trừ khi bị chặn cả hai đầu."; Tự do đổi câu thành "…kể cả khi bị chặn cả hai đầu."
- **Automated:** `tests/e2e/win-rule/rule-choice.e2e.ts`

### TC-WINRULE-010 — ván đã kết thúc khoá bàn và các nút đang chơi

- **Requirement:** REQ-WINRULE-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thắng như TC-WINRULE-001 → bấm một ô trống
- **Mong đợi:** vẫn 9 nước; Hoàn, Gợi ý, Bỏ ván tắt; Chơi lại và Xem lại hiện
- **Automated:** `tests/e2e/win-rule/five.e2e.ts`

### TC-WINRULE-011 — luật của ván sống qua tải lại, không bị luật mặc định trong cài đặt đè

- **Requirement:** REQ-WINRULE-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** ván Tự do, đánh 0, 0 → cài đặt: Luật mặc định = Caro Việt → tải lại → đánh tiếp thế chặn hai đầu
- **Mong đợi:** ván tiếp tục và "Người 1 thắng" (vẫn là Tự do)
- **Automated:** `tests/e2e/win-rule/rule-choice.e2e.ts`

### TC-WINRULE-012 — Chơi lại đưa về màn bắt đầu và ván mới bắt đầu từ bàn trống

- **Requirement:** REQ-WINRULE-11
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** thắng như TC-WINRULE-001 → Chơi lại → bắt đầu ván mới
- **Mong đợi:** màn bắt đầu hiện; sau khi bắt đầu, danh sách nước trống, không còn kết quả cũ
- **Automated:** `tests/e2e/win-rule/rule-choice.e2e.ts`
