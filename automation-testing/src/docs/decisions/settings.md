# SETTINGS — Quyết định

Đi cặp với `docs/requirements/settings.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-14, FR-16), `docs/01-product/journeys.md` (US-01 "Trình duyệt chặn âm
  thanh — phải im lặng, không được vỡ", US-04, US-06 "dữ liệu cài đặt hỏng"), `docs/02-requirements/nfr.md`
  (NFR-DATA-04, NFR-A11Y-04), `docs/decisions/0019-settings-live-in-their-own-seam.md`,
  `0021-sound-is-synthesised-and-silence-is-valid.md`, `docs/specs/keyboard-sound-settings/design.md`, `README.md`
  §"Sound, synthesised on the spot", §"Settings that belong to the machine, not to you".
- **Code:** `client/src/views/Home/mains/SettingsSheet`, `client/src/views/Home/mains/Header`,
  `client/src/game/settings/settingsStore.ts` (một giá trị sai → cả khối về `DEFAULT_SETTINGS`),
  `client/src/game/audio/index.ts` (880Hz nước người, 440Hz nước máy), `client/src/views/Home/ghosts/PlayMoveSound`,
  `client/src/views/Home/index.tsx` (chờ cài đặt đọc xong mới dựng màn bắt đầu).
- **Test đã gom (gợi ý):** `client/e2e/persistence.spec.ts` "cài đặt sống qua reload, và nó là seam RIÊNG" →
  TC-SETTINGS-008, "xoá toàn bộ dữ liệu dọn CẢ hai seam" → TC-SETTINGS-010.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Âm thanh chứng minh không cần loa thế nào? → Bọc Web Audio API (initScript): đếm context, oscillator, ghi tần số
  từng oscillator được `start`, đếm `decodeAudioData`; cộng với không request nào tới file âm thanh. Bật = có oscillator
  khi đánh, nước người và nước máy khác tần số; tắt = không oscillator mới.
- **Q2** "Trình duyệt chặn âm thanh" giả bằng `AudioContext` ném `NotAllowedError` khi khởi tạo.
- **Q3** Ô âm thanh trong Cài đặt hiện **trạng thái** ("Bật âm thanh" khi đang bật), còn nút header hiện **hành động**
  ("Tắt âm thanh" khi đang bật). Hai cách ghi khác nhau là chủ ý của code (comment trong `Header`); requirement chỉ đòi hai
  chỗ khớp **giá trị**, không đòi cùng chữ.
- **Q4** Hộp thoại Cài đặt không đóng bằng phím Esc và không chuyển focus vào trong khi mở. Không tài liệu nào của app hứa
  điều đó (US-07 chỉ hứa Esc cho menu tài khoản); đóng bằng Tab tới "Đóng" + Enter vẫn được. Ghi lại như quan sát, không
  phải requirement.
- **Q5** Cài đặt hỏng: gieo một khối có `pieceSet: "rainbow"` và `defaultLevel: "hard"` — vì một giá trị sai làm cả khối về
  mặc định, màn bắt đầu phải chọn Thường (không phải Khó) và bộ quân về Bút chì.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Âm lượng (bị từ chối trong SettingsSheet, không có điều khiển).
- Giao diện sáng / tối và bộ quân: module `theme` và `piece-set`.
- Esc / bẫy focus của hộp thoại (Q4).

## Tech debt liên quan

_(không có)_
