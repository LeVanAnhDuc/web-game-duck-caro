# HOTSEAT — Quyết định

Đi cặp với `docs/requirements/hotseat.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-17), `docs/01-product/journeys.md` (US-05 toàn bộ, kể cả "Điều gì có
  thể sai"), `docs/01-product/overview.md` §4 (hot-seat dừng ở hai ghế: không tên, không đồng hồ, không thống kê),
  `docs/decisions/0024-side-is-a-seat-and-a-controller-sits-in-it.md`, `0028-a-two-seat-bar-replaces-the-status-line.md`,
  `docs/specs/v2/design.md` §1, §5, `README.md` §"Play against the machine, or against the person next to you".
- **Code:** `client/src/views/Home/mains/StartOverlay/index.tsx`, `client/src/views/Home/components/SeatBar/index.tsx`,
  `client/src/hooks/useGame.ts` (`place`, `undoMove`, `giveUp`), `client/src/views/Home/index.tsx` (`hasEngine` ẩn
  StatsPanel), `client/src/views/Home/ghosts/RecordResult`, `client/src/lib/strings.ts` (`seatName`).
- **Test đã gom (gợi ý):** `client/e2e/hotseat-and-theme.spec.ts` "hai người đánh luân phiên, engine KHÔNG đánh nước nào"
  → TC-HOTSEAT-002, "hoàn nước lùi MỘT nước" → TC-HOTSEAT-004, "màn kết ván gọi tên GHẾ" → TC-HOTSEAT-005.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Máy không đánh" chứng minh thế nào mà không chờ mù? Bản cũ chờ 2.5s rồi đếm nước. → Đếm số thông điệp trang gửi
  cho Worker (bọc `Worker.prototype.postMessage` bằng initScript): phải bằng 0. Chứng minh trực tiếp "không hỏi máy", và
  không cần `waitForTimeout`.
- **Q2** "Ghế đang tới lượt" nhận biết bằng gì? → Độ đậm chữ (`font-weight: 600`) và gạch chân 3px của nửa thanh ghế đó —
  đúng hai tín hiệu ADR-0028 chọn (vị trí + độ đậm, màu chỉ là lớp dư).
- **Q3** US-05 liệt kê "Gợi ý được bấm ở chế độ hai người" là rủi ro nhưng không chốt cấm; app hiện cho bấm. Không có
  requirement nào bắt tắt → không viết case; ghi ở Ngoài phạm vi.
- **Q4** US-05 "đổi chế độ giữa ván phải hỏi xác nhận": app không có lối đổi chế độ giữa ván (comment trong
  `views/Home/index.tsx`: muốn đổi thì Bỏ ván rồi bắt đầu lại). Không có lối thì không có gì để hỏi → không có case.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Gợi ý trong ván hai người (Q3).
- Xoay nhãn cho người ngồi đối diện: ADR-0028 đã bác.
- Màu gạch chân theo màu quân của ghế: kiểm bằng mắt (MASTER.md), không kiểm ở e2e.

## Tech debt liên quan

- `docs/04-state/backlog.md` §Nợ kỹ thuật: ván hot-seat không được ghi thống kê (có chủ ý, overview.md §4).
