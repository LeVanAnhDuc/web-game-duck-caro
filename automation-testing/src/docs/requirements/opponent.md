# OPPONENT — Đấu máy

Truy vết phía app: FR-04 · FR-05 · FR-06 · US-01 · US-02 · NFR-REL-01 · NFR-REL-03 · ADR-0004 · ADR-0005 · bất biến 7, 15.

- **REQ-OPPONENT-01** Ở chế độ đấu máy, máy (Web Worker thật) trả lời mỗi nước của người chơi và báo "Máy đánh ở x, y. Lượt bạn."
- **REQ-OPPONENT-02** Chọn "Máy" đi trước thì máy tự đánh nước đầu, không cần người chơi bấm gì.
- **REQ-OPPONENT-03** Có ba mức Dễ · Thường · Khó; màn bắt đầu chọn sẵn mức mặc định (Thường khi chưa cài đặt gì); mức của ván hiện ở header và máy trả lời ở cả ba mức.
- **REQ-OPPONENT-04** Trong lúc máy nghĩ: thanh hai ghế ghi "Máy đang nghĩ…", bấm lên bàn không đặt thêm quân, nút Gợi ý tắt.
- **REQ-OPPONENT-05** Máy chặn nước thắng của người chơi khi chỉ còn một ô để chặn.
- **REQ-OPPONENT-06** Máy đi nước thắng khi có; ván kết thúc với "Máy thắng".
- **REQ-OPPONENT-07** Máy không trả lời (worker chết hoặc treo): sau tối đa 5 giây trạng thái "đang nghĩ" kết thúc kèm thông báo, không bao giờ treo vô hạn.
- **REQ-OPPONENT-08** Sau khi máy không trả lời kịp, ván vẫn đi tiếp được (NFR-REL-01: "worker không trả lời → game vẫn đi tiếp").
