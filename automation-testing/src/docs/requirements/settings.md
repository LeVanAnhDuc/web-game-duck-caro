# SETTINGS — Cài đặt, âm thanh và xoá dữ liệu

Truy vết phía app: FR-14 · FR-16 · US-02 · US-04 · NFR-DATA-04 · NFR-A11Y-04 · ADR-0019 · ADR-0021 · bất biến 5.

- **REQ-SETTINGS-01** Nút "Cài đặt" ở header mở hộp thoại Cài đặt; nút "Đóng" đóng nó.
- **REQ-SETTINGS-02** Âm thanh bật / tắt được từ nút ở header và từ ô trong Cài đặt; hai chỗ luôn khớp nhau. Nút header gọi tên **hành động** sẽ xảy ra ("Tắt âm thanh" khi đang bật) và mang `aria-pressed`.
- **REQ-SETTINGS-03** Âm thanh tổng hợp tại chỗ: khi bật, mỗi nước phát tiếng bằng bộ dao động, nước của người và của máy khác **cao độ**; không tải hay giải mã file âm thanh nào. Khi tắt, không phát gì.
- **REQ-SETTINGS-04** Trình duyệt chặn âm thanh: game im lặng và vẫn chơi bình thường.
- **REQ-SETTINGS-05** "Mức khó mặc định" điền sẵn mức ở màn bắt đầu — kể cả ván đầu tiên ngay sau khi tải trang.
- **REQ-SETTINGS-06** "Luật mặc định" điền sẵn luật ở màn bắt đầu.
- **REQ-SETTINGS-07** Cài đặt sống qua tải lại trang và được lưu ở khoá riêng của máy (`gomoku:v2:settings`), tách khỏi ván và thống kê.
- **REQ-SETTINGS-08** "Xoá toàn bộ dữ liệu" hỏi xác nhận bằng câu nói rõ không có bản sao; "Thôi" huỷ; "Xoá hẳn" xoá ván đang dở, thống kê và cài đặt.
- **REQ-SETTINGS-09** Cài đặt là nơi dạy phím: có mục Bàn phím liệt kê mũi tên, Enter, Shift + mũi tên, + / −, Home.
- **REQ-SETTINGS-10** Mọi điều khiển trong Cài đặt có nhãn đọc được: ô âm thanh gắn nhãn "Âm thanh", mỗi nhóm nút có tên nhóm.
- **REQ-SETTINGS-11** Cài đặt lưu bị hỏng hoặc chứa giá trị không tồn tại: về mặc định, không vẽ ra lựa chọn rỗng.
