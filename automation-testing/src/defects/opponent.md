# OPPONENT — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-OPPONENT-01](#bug-opponent-01) | Cao | TC-OPPONENT-009 | Máy không trả lời kịp thì ván kẹt: không bấm được ô nào dù thông báo bảo "thử đánh lại" |

### BUG-OPPONENT-01

- **TC:** TC-OPPONENT-009 · **Requirement:** REQ-OPPONENT-08
- **Bước tái hiện:** Worker không trả lời (treo hoặc chết) → ván đấu máy → đánh một nước → chờ 5 giây.
- **Mong đợi:** ván đi tiếp — NFR-REL-01 hứa "hết hạn thì dùng nước dự phòng … game vẫn đi tiếp", và thông báo hứa
  "thử đánh lại một nước".
- **Thực tế:** thông báo "Máy không trả lời kịp — thử đánh lại một nước" hiện ra, nhưng lượt vẫn là của máy
  (`useGame.askEngine` chỉ đặt thông báo khi hết giờ, không đánh nước dự phòng, không trả lượt, không hỏi lại engine), nên
  `place` bỏ qua mọi cú bấm. Thanh ghế đứng ở "Máy". Đường thoát duy nhất là Hoàn hoặc Bỏ ván.
- **Ghi chú:** ghi ngày 2026-10-17, Chromium, bản xuất tĩnh.

## Đã sửa

_(chưa có)_
