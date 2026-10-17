# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.

### TC-ACCESSIBILITY-001 — canvas có tên và đến được bằng Tab ngay sau hai nút header

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở game → Tab ba lần
- **Mong đợi:** lần lượt "Tắt âm thanh", "Cài đặt", rồi canvas; canvas có nhãn "Bàn caro. Mũi tên dịch con trỏ, …"
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-002 — chơi được chỉ bằng bàn phím, không một cú chuột nào

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** Enter trên nút Dễ và Bắt đầu → Tab tới canvas → → (đặt con trỏ ở 0, 0) → → → ↓ → Enter → ↑ ↑ → Space
- **Mong đợi:** nước 1 ở `1, 1`, máy trả lời; nước 3 ở `1, −1`, máy trả lời (4 nước)
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-003 — vùng live đọc ô trống hoặc quân của ai trước khi đánh

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** ván Dễ → focus canvas → → (con trỏ hiện ở 0, 0) → đọc vùng live → Enter → đọc lại → di con trỏ tới ô của máy
- **Mong đợi:** "Con trỏ ở 0, 0. Ô trống." trước khi đánh; sau khi đánh "… Ô này là quân của bạn."; trên ô của máy "… quân của máy."
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-004 — Shift + mũi tên kéo bàn, không đánh quân, con trỏ giữ chỗ trên màn hình

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** ván Hai người → focus canvas → → (con trỏ 0, 0) → Shift+→ sáu lần → bấm chuột vào tâm canvas
- **Mong đợi:** không nước nào trong lúc kéo; vùng live "Con trỏ ở 6, 0"; cú bấm tâm ra ô `6, 0` (con trỏ vẫn ở giữa màn)
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-005 — phím + và − thu phóng quanh giữa khung nhìn

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 3
- **Bước:** ván Hai người → focus canvas → `+` (32 → 36px) → bấm cách tâm 72px sang phải → focus canvas → `−` hai lần (36 → 28px) → bấm cách tâm 56px sang trái
- **Mong đợi:** lần đầu ra ô `2, 0`, lần sau ra ô `−2, 0`
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-006 — phím Home đưa mọi quân về khung nhìn

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 4
- **Bước:** ván Hai người → đánh 0, 0 → focus canvas → Shift+→ mười lần → Home → bấm tâm canvas
- **Mong đợi:** "Ô đó đã có quân" — quân ở 0, 0 đã về giữa
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-007 — phím h xin gợi ý và u hoàn nước

- **Requirement:** REQ-ACCESSIBILITY-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** ván Dễ → focus canvas → Enter (đánh 0, 0) → `h` → `u`
- **Mong đợi:** sau `h` thông báo "Gợi ý: đánh ở …" và vẫn 2 nước; sau `u` còn 0 nước
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-008 — con trỏ đi ra khỏi khung nhìn thì khung nhìn đi theo

- **Requirement:** REQ-ACCESSIBILITY-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** ván Hai người → focus canvas → → (con trỏ ở 0, 0) rồi → thêm hai mươi lần → Enter → bấm chuột vào tâm canvas
- **Mong đợi:** nước đầu ở `20, 0`; cú bấm tâm không ra ô `0, 0` (khung đã dời)
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-009 — phím lạ không giữ focus, Tab vẫn rời canvas

- **Requirement:** REQ-ACCESSIBILITY-08
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 5
- **Bước:** focus canvas → bấm `q` → Tab
- **Mong đợi:** canvas không còn focus
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-010 — dòng thông báo là vùng live đọc mỗi nước và kết quả ván

- **Requirement:** REQ-ACCESSIBILITY-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** ván Hai người → đánh 0, 0 → đánh 1, 1 → Bỏ ván
- **Mong đợi:** vùng `role=status` `aria-live=polite` đọc "Người 1 đánh ở 0, 0.", "Người 2 đánh ở 1, 1.", rồi "Người 1 đã bỏ ván"
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`

### TC-ACCESSIBILITY-011 — mọi nút ở màn bắt đầu, trong ván và khi xem lại rộng và cao ít nhất 44px

- **Requirement:** REQ-ACCESSIBILITY-10
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** đo mọi nút đang hiện ở màn bắt đầu, trong ván Hai người, và trong xem lại sau khi bỏ ván
- **Mong đợi:** không nút nào hẹp hoặc thấp hơn 44px
- **Automated:** `tests/e2e/accessibility/screen-reader.e2e.ts`
