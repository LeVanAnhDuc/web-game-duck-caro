# THEME — Quyết định

Đi cặp với `docs/requirements/theme.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-19), `docs/01-product/journeys.md` (US-06 và "Điều gì có thể sai": nháy
  sáng khi tải, canvas không vẽ lại, đổi thiết lập hệ điều hành lúc trang đang mở), `docs/02-requirements/nfr.md`
  (NFR-PERF-10), `docs/decisions/0026-theme-is-three-states-resolved-before-first-paint.md`, `docs/specs/v2/design.md` §3,
  `docs/design-system/gomoku/MASTER.md` §1–§2, `README.md` §"Settings that belong to the machine".
- **Code:** `client/src/game/render/theme.ts` (`themeBootScript`, `applyTheme`: "Theo máy" = bỏ thuộc tính `data-theme`),
  `client/src/app/layout.tsx` (script trong `<head>`), `client/src/app/globals.css` (`--paper` sáng `#f7f3e8`, tối
  `#191c20`), `client/src/hooks/useBoardCanvas.ts` (MutationObserver + `prefers-color-scheme` → đọc lại bảng màu).
- **Test đã gom (gợi ý):** `client/e2e/hotseat-and-theme.spec.ts` "giao diện tối được đặt TRƯỚC lần vẽ đầu — không nháy"
  → TC-THEME-004.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Sáng / tối nhận biết bằng gì? → Giá trị `--paper` mà CSS đang áp (`#f7f3e8` sáng, `#191c20` tối, MASTER.md) và
  điểm ảnh nền của canvas ở tâm một ô trống. Màu là token đã chốt trong MASTER.md nên so trực tiếp được.
- **Q2** "Trước lần vẽ đầu" đo thế nào? Bản cũ đọc `data-theme` sau khi tải xong — một cú nháy vẫn lọt. → Một initScript
  đặt `requestAnimationFrame` ngay từ đầu tài liệu; callback đó chạy trước lần vẽ đầu tiên, và ghi lại `data-theme` +
  `--paper` lúc ấy.
- **Q3** Ván đang chơi "không bị ảnh hưởng" = danh sách nước, lượt và kết quả giữ nguyên, và đánh tiếp được.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Tương phản của từng token ở hai bảng màu (NFR-A11Y-01): kiểm trong MASTER.md + unit test token.
- Lưu trữ bị chặn thì lựa chọn không lưu được: module `persistence` đã kiểm game không vỡ khi `localStorage` ném lỗi.

## Tech debt liên quan

_(không có)_
