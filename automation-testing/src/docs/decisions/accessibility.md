# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-15), `docs/02-requirements/nfr.md` (NFR-A11Y-02/03/04/05/06),
  `docs/decisions/0020-keyboard-cursor-with-shift-to-pan.md`, `0022-e2e-runs-against-the-static-build.md`,
  `0018-clickable-move-rows-are-44px.md`, `docs/specs/keyboard-sound-settings/design.md`, `README.md` §"Playable with the
  keyboard alone" + §Controls ("Shift + arrow keys — The cursor keeps its place on screen").
- **Code:** `client/src/hooks/useBoardCanvas.ts` (`onKeyDown`: mũi tên, Shift, Enter/Space, `+ = -`, `Home`;
  `KEY_ZOOM_STEP_PX = 4`; `ensureVisible`), `client/src/views/Home/mains/BoardStage` (`h`, `u`, `tabIndex`,
  `aria-label`), `client/src/views/Home/components/CursorLive`, `NoticeLine`, `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `client/e2e/keyboard.spec.ts` — "canvas nằm trong thứ tự Tab" → TC-ACCESSIBILITY-001, "chơi
  được chỉ bằng bàn phím" → TC-ACCESSIBILITY-002 / -006, "vùng live của con trỏ nói ô đã có quân TRƯỚC khi bấm" →
  TC-ACCESSIBILITY-003, "Shift + mũi tên kéo bàn" → TC-ACCESSIBILITY-004, "phím lạ không chặn Tab" → TC-ACCESSIBILITY-008.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Chạy trên bản build tĩnh (ADR-0022) — overlay dev của Next nằm trong thứ tự Tab và làm sai phép đo. Cấu hình suite
  đã bảo đảm điều đó cho mọi module.
- **Q2** Thu phóng bằng phím kiểm như thu phóng bằng chuột (module `board`): sau `+` cạnh ô 36px quanh tâm, bấm cách tâm
  72px phải ra ô `2, 0`; sau hai lần `−` cạnh ô 28px, bấm cách tâm 56px sang trái ra `−2, 0`.
- **Q3** "Khung nhìn đi theo con trỏ" kiểm bằng hệ quả: sau 20 lần → (khung chỉ rộng ~15 ô mỗi bên), bấm chuột vào tâm
  canvas không còn ra ô `0, 0`.
- **Q4** Vùng bấm 44px đo bằng `boundingBox` của mọi `button` đang hiện ở ba màn: màn bắt đầu, ván đang chơi (header +
  cột phải), xem lại. Ô trên bàn nhỏ hơn 44px là cố ý (NFR-A11Y-03 đã sửa cho bàn vô hạn) — không đo.
- **Q5** NFR-A11Y-05 (`prefers-reduced-motion`): camera không có hiệu ứng trượt nào và không có animation thắng ở cả hai
  chế độ — không có gì để tắt, nên không có case.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thử với trình đọc màn hình thật (NFR-A11Y-06 "thử một lượt"): e2e chỉ kiểm vai trò `status` + `aria-live` và nội dung.
- Tương phản màu (NFR-A11Y-01): MASTER.md.
- Esc / bẫy focus của hộp thoại Cài đặt: xem decisions/settings.md Q4.

## Tech debt liên quan

_(không có)_
