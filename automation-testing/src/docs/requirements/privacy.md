# PRIVACY — Không gì rời trình duyệt

Truy vết phía app: NFR-SEC-07 · NFR-DATA-01 · overview.md (không server, không tài khoản game, không analytics) · README §"No game accounts, no server, nothing leaves the browser".

- **REQ-PRIVACY-01** Từ lúc tải tới hết một ván (đánh, máy trả lời, gợi ý, bỏ ván, xem lại), trang không gửi request nào ra ngoài origin của chính nó: không analytics, không telemetry, không font ngoài.
- **REQ-PRIVACY-02** Trang không đặt cookie nào.
- **REQ-PRIVACY-03** Bộ nhớ trình duyệt chỉ chứa khoá của game (`gomoku:…`): ván đang dở, thống kê, cài đặt — không gì khác.
- **REQ-PRIVACY-04** Mất mạng sau khi trang đã tải xong: vẫn chơi tiếp được, máy vẫn trả lời và gợi ý vẫn chạy.
- **REQ-PRIVACY-05** Console không có lỗi và trang không có lỗi chưa bắt suốt một ván đầy đủ.
