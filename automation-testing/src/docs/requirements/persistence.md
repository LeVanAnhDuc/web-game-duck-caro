# PERSISTENCE — Lưu và tiếp tục ván

Truy vết phía app: FR-11 · US-02 · NFR-REL-04 · ADR-0006 · bất biến 1, 5.

- **REQ-PERSISTENCE-01** Ván đang dở sống qua một lần tải lại trang: đủ nước, đúng lượt, đúng mức khó, không phải chọn lại gì.
- **REQ-PERSISTENCE-02** Rời đi đúng lúc máy đang nghĩ: mở lại thì máy nghĩ và đánh ngay.
- **REQ-PERSISTENCE-03** Ván đã kết thúc không còn gì để tiếp tục: tải lại thì về màn bắt đầu.
- **REQ-PERSISTENCE-04** "Chơi lại" xoá ván cũ khỏi bộ nhớ: tải lại sau đó về màn bắt đầu, không hồi lại ván cũ.
- **REQ-PERSISTENCE-05** `localStorage` bị chặn: game vẫn chơi được, được phép quên ván sau tải lại, và im lặng — không thông báo lỗi, không lỗi trang.
- **REQ-PERSISTENCE-06** Dữ liệu lưu bị hỏng hoặc sai hình dạng (kể cả từ phiên bản cũ): bị bỏ qua, vào màn bắt đầu, không lỗi trang.
- **REQ-PERSISTENCE-07** Bộ nhớ đầy (ghi ném lỗi): game vẫn chơi được và máy vẫn trả lời.
