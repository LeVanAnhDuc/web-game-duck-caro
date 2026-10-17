# RESPONSIVE — Bố cục theo khổ màn hình

Truy vết phía app: US-01 · US-07 · MASTER.md (mobile 375 trước) · feature-flow §1 (ba khổ 375 / 768 / 1440).

- **REQ-RESPONSIVE-01** Không có thanh cuộn ngang ở bất kỳ khổ nào từ 320 đến 1440px, kể cả khi đang chơi.
- **REQ-RESPONSIVE-02** Từ 1024px có cột phải (thông báo, danh sách nước, thành tích, nút); dưới 1024px không có cột phải mà có dòng thông báo và thanh nút ở đáy (Hoàn · Gợi ý · Giữa · Bỏ ván), và chơi được bình thường.
- **REQ-RESPONSIVE-03** Trên thanh nút hẹp, "Bỏ ván" chỉ còn icon nhưng vẫn có tên "Bỏ ván" cho trình đọc màn hình và vẫn rộng, cao 44px.
- **REQ-RESPONSIVE-04** Cài đặt là sheet neo đáy, rộng hết màn dưới 1024px; từ 1024px là cột bám mép phải cửa sổ.
- **REQ-RESPONSIVE-05** Dưới 1024px, kết ván hiện thành sheet có "Chơi lại" và "Xem lại", và xem lại là sheet ở đáy có vị trí và nút điều hướng.
- **REQ-RESPONSIVE-06** Bàn mở với ô 28px khi canvas rộng không quá 640px, và 32px khi rộng hơn.
