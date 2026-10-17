# DUCKERID — Đăng nhập Ducker ID tuỳ chọn (sau cờ tính năng)

Truy vết phía app: FR-21 · US-07 · ADR-0029 · NFR-A11Y-03 · NFR-SEC-07.

- **REQ-DUCKERID-01** Cờ tắt (bản deploy): không nút đăng nhập, không menu tài khoản, không chạm `sessionStorage`, không request ra ngoài site, và `?code=` / `?state=` trên URL bị bỏ mặc.
- **REQ-DUCKERID-02** Cờ bật: bấm "Đăng nhập" đi qua Ducker ID và quay về đúng màn cũ, URL sạch (không `code` / `state` / `error`), nút tài khoản hiện chữ cái đầu của tên; không lỗi hydration.
- **REQ-DUCKERID-03** Menu tài khoản hiện tên, email, "Mở hồ sơ Ducker ID" trỏ tới trang hồ sơ trên issuer, và "Đăng xuất"; Esc đóng menu và trả focus về nút tài khoản; bấm ra ngoài hoặc Tab cũng đóng menu.
- **REQ-DUCKERID-04** Đăng xuất đưa nút "Đăng nhập" trở lại và đặt focus vào nó.
- **REQ-DUCKERID-05** Đăng nhập không đổi gì về cách chơi: đã đăng nhập vẫn đánh với máy như thường.
- **REQ-DUCKERID-06** Hồ sơ chỉ nằm trong bộ nhớ: không ghi xuống `localStorage` / `sessionStorage`, khoá `ducker.pkce` bị xoá khi quay về, và tải lại trang là chưa đăng nhập.
- **REQ-DUCKERID-07** Từ chối ở Ducker ID, hoặc `state` bị sửa, thì về chưa đăng nhập, URL sạch, không báo lỗi; `state` sai thì không bao giờ gọi tới token endpoint.
- **REQ-DUCKERID-08** Ducker ID không trả lời thì sau tối đa 15 giây về lại chưa đăng nhập.
- **REQ-DUCKERID-09** `sessionStorage` bị chặn thì bấm "Đăng nhập" không đưa đi đâu cả, nút vẫn dùng được.
- **REQ-DUCKERID-10** Ở 320–375px nút đăng nhập không đè lên chip mức khó, âm thanh, cài đặt: mọi nút header ≥ 44px, tên app không xuống dòng, không cuộn ngang; menu tài khoản luôn nằm trọn trong màn và mở ra không làm header nhảy.
