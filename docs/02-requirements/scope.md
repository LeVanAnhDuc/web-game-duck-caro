# Danh mục chức năng

> **Trả lời:** Hệ thống có những chức năng nào, mỗi cái đang ở trạng thái gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-11 · commit —
> **Cập nhật khi:** brainstorm ra chức năng mới (cấp FR mới) · một FR chuyển trạng thái

<!-- CÁCH ĐIỀN
Chỉ LIỆT KÊ. Một dòng một chức năng, tên ngắn. Cách làm thuộc tài liệu thiết kế
của feature, không thuộc đây.

ID cấp tăng dần, không tái dùng, không xoá. Bỏ một chức năng thì đổi trạng thái
thành (bỏ) và giữ số — vì commit và test cũ vẫn tham chiếu ID đó.

Trạng thái: chưa · đang · xong · (bỏ)

KHÔNG chứa: cách hiện thực, ngưỡng phi chức năng (-> nfr.md), lý do chọn giải pháp
(-> decisions/).
-->

| ID | Chức năng | Thuộc luồng | Trạng thái |
| --- | --- | --- | --- |
| FR-01 | Bàn vô hạn: vẽ, kéo, thu phóng, về giữa | US-01 | xong |
| FR-02 | Đánh quân | US-01 | xong |
| FR-03 | Phát hiện thắng trên đoạn cực đại, tô chuỗi thắng | US-01 | xong |
| FR-04 | Engine AI chạy trong Web Worker | US-01 | xong |
| FR-05 | Ba mức khó | US-01 · US-04 | xong |
| FR-06 | Chọn quân và chọn ai đi trước | US-01 · US-02 | xong |
| FR-07 | Hoàn nước | US-03 | xong |
| FR-08 | Lịch sử nước đi | US-03 | xong |
| FR-09 | Xem lại ván (chỉ đọc) | US-03 | xong |
| FR-10 | Gợi ý nước đi | US-01 | xong |
| FR-11 | Lưu và tiếp tục ván đang chơi | US-02 | xong |
| FR-12 | Thống kê thắng / thua / bỏ ván theo từng mức | US-01 · US-04 | xong |
| FR-13 | Bỏ ván | US-04 | xong |
| FR-14 | Âm thanh tổng hợp bằng WebAudio, không file | US-01 | xong |
| FR-15 | Con trỏ bàn phím và vùng `aria-live` | US-01 | xong |
| FR-16 | Cài đặt: âm thanh, mức khó mặc định | US-02 · US-04 | xong |
| FR-17 | Chơi hai người trên cùng một máy (hot-seat) | US-05 | đang |
| FR-18 | Chọn luật thắng cho từng ván: caro Việt · tự do | US-05 · US-01 | đang |
| FR-19 | Giao diện sáng · tối · theo máy | US-06 | đang |
| FR-20 | Đổi bộ quân: Bút chì · Đặc/rỗng · Hình học · Vịt | US-06 | đang |
