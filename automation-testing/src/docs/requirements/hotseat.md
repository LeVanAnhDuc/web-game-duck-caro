# HOTSEAT — Hai người trên một máy

Truy vết phía app: FR-17 · US-05 · ADR-0024 · ADR-0028 · bất biến 15 · overview.md §4.

- **REQ-HOTSEAT-01** Chọn chế độ "Hai người" ở màn bắt đầu: mục Mức khó biến mất, hai nút "Ai đi trước" thành Người 1 / Người 2, và header ghi "Hai người" khi vào ván.
- **REQ-HOTSEAT-02** Hai ghế đánh luân phiên trên cùng một bàn; máy không bao giờ được hỏi nước nào.
- **REQ-HOTSEAT-03** Thanh hai ghế làm nổi ghế đang tới lượt (đậm, gạch chân) và đổi sang ghế kia sau mỗi nước; thông báo nêu ghế vừa đánh.
- **REQ-HOTSEAT-04** Hoàn nước lùi đúng **một** nước — trả lại nước vừa đánh, không xoá nước của người kia.
- **REQ-HOTSEAT-05** Kết ván gọi tên ghế ("Người 2 thắng"), không bao giờ "Bạn" hay "Máy"; Bỏ ván là do ghế đang tới lượt bỏ.
- **REQ-HOTSEAT-06** Ván hai người không vào thống kê, và bảng Thành tích không hiện trong ván hai người.
- **REQ-HOTSEAT-07** Chọn Người 2 đi trước thì nước đầu tiên thuộc về Người 2.
- **REQ-HOTSEAT-08** Mở lại tab giữa ván hai người: ván tiếp tục đúng chế độ, đúng lượt, và máy vẫn không được hỏi.
