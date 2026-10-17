# ACCESSIBILITY — Bàn phím, trình đọc màn hình, vùng bấm

Truy vết phía app: FR-15 · NFR-A11Y-02 · NFR-A11Y-03 · NFR-A11Y-04 · NFR-A11Y-06 · ADR-0020 · ADR-0022.

- **REQ-ACCESSIBILITY-01** Bàn (canvas) có tên đọc được nói cách dùng phím, và đến được bằng Tab ngay sau hai nút của header.
- **REQ-ACCESSIBILITY-02** Chơi được trọn một ván chỉ bằng bàn phím: mở ván bằng Enter, mũi tên dịch con trỏ, Enter hoặc Space đánh vào ô con trỏ.
- **REQ-ACCESSIBILITY-03** Vùng live thứ hai đọc toạ độ con trỏ và ô đó trống hay là quân của ai — **trước** khi đánh.
- **REQ-ACCESSIBILITY-04** Shift + mũi tên kéo bàn mà không đánh quân; con trỏ đi cùng một ô, giữ nguyên chỗ trên màn hình.
- **REQ-ACCESSIBILITY-05** `+` / `−` thu phóng quanh giữa khung nhìn; `Home` đưa mọi quân về khung nhìn.
- **REQ-ACCESSIBILITY-06** `h` xin gợi ý, `u` hoàn nước — không cần chuột.
- **REQ-ACCESSIBILITY-07** Con trỏ bàn phím đi ra khỏi khung nhìn thì khung nhìn đi theo nó.
- **REQ-ACCESSIBILITY-08** Phím không dùng tới không giữ focus lại: Tab vẫn rời được canvas.
- **REQ-ACCESSIBILITY-09** Dòng thông báo là vùng `aria-live="polite"` đọc mỗi nước kèm toạ độ, và kết quả ván.
- **REQ-ACCESSIBILITY-10** Mọi nút thật có vùng bấm tối thiểu 44 × 44px.
