# Ghi chú về chính lượt chạy này — 2026-09-11

**Đích đo:** bản deploy <https://levananhduc.github.io/web-game-duck-caro/> (HTTP 200, tiêu đề
trang "Duck Caro" — đã đối chiếu dấu hiệu nhận biết). KHÔNG đo code trong thư mục làm việc.
Nhánh hiện tại là `main`.

**Công cụ trình duyệt: Playwright (hạng 1).** Không degrade. Đủ cả bảy năng lực bắt buộc:
điều hướng · click · nhập liệu · chụp màn hình · đọc console · đặt viewport · throttle mạng
(throttle làm qua CDP `Network.emulateNetworkConditions` trong `browser_run_code_unsafe`).

**Chạy TUẦN TỰ, không song song.** Máy chủ MCP Playwright ở đây chỉ có một instance trình
duyệt dùng chung, nên 4 phiên đồng thời sẽ giẫm lên viewport và tab của nhau. Trần 4 phiên
đồng thời của `orchestration.md` vì vậy không dùng được — chỉ giãn thời gian, không cắt phạm
vi: vẫn đủ 5 Red Route + 2 phiên mù.

## Ba trục trặc kỹ thuật đã xảy ra, và chúng bóp méo cái gì

1. **Agent `ux-persona` không chạy được.** Định nghĩa của nó khai `tools: mcp__playwright__*`,
   nhưng tên thật của bộ tool trong phiên này là `mcp__plugin_playwright_playwright__*` —
   wildcard không khớp, nên agent chỉ nhận được `claude-in-chrome` (tiện ích chưa kết nối).
   Đã sửa dòng `tools:` trong `.claude/agents/ux-persona.md` thành danh sách liệt kê đầy đủ,
   nhưng thay đổi đó chỉ có hiệu lực ở phiên Claude Code SAU.
   **Cách đi vòng đã dùng:** chạy 7 phiên bằng agent trắng (`general-purpose`, model Sonnet),
   nhét nguyên văn phần hướng dẫn vai của `ux-persona.md` vào brief, kèm rào cứng cấm mọi tool
   ngoài nhóm Playwright.
   *Ảnh hưởng tới tính "người lạ":* agent trắng khởi động không mang context của người điều
   phối, nên vẫn là người lạ đúng nghĩa. Nhưng nó CÓ quyền dùng Read/Bash — rào chỉ là câu chữ,
   không phải rào kỹ thuật. Một agent (p02) tự khai đã gọi `Read` một lần, để xem chính ảnh nó
   vừa chụp, không phải đọc mã nguồn.

2. **Ảnh của phiên p01 bị ghi lạc chỗ, và suýt bị kết luận nhầm là đã mất.** Phiên p01 chạy
   trước khi phát hiện phải truyền `filename` cho `browser_take_screenshot`, nên 8 tấm ảnh của
   nó được ghi vào **gốc repo** thay vì thư mục run. Lệnh `find` chạy lúc đó không ra kết quả,
   nên cả `ux-expert` lẫn bản đầu của báo cáo đều làm việc với giả định "ảnh p01 đã mất".
   **Ảnh đã tìm lại được đủ 8 tấm** trước khi commit và đã chuyển vào `shots/`. Tấm chụp bù
   `p01-rr01-01-mo-dau-TAI-DUNG.png` đã bị xoá vì trùng lặp.
   *Bài học cho lần sau:* mọi phiên phải truyền `filename` kèm đường dẫn ngay từ tấm đầu tiên.

3. **Phiên p03 (Hạnh) mở trang vào một ván đang dở.** Lệnh `localStorage.clear()` chạy trên
   trang đang mở bị chính app ghi đè lại trước lần tải kế tiếp, nên Hạnh thấy bàn cờ của phiên
   p02 chứ không phải màn hình thiết lập của người mới.
   **Hệ quả:** phần "Ấn tượng 5 giây" của p03 KHÔNG so sánh được với các persona khác — cô
   đang tả một ván đang dở, không phải trang chủ. Đừng tính p03 vào bảng ấn tượng đầu của
   trang chủ. Phần đánh giá bàn phím (lõi của RR-05) không bị ảnh hưởng.
   Từ p04 trở đi đã đổi sang xoá qua CDP `Storage.clearDataForOrigin` khi app đã bị gỡ khỏi
   trang, và mỗi phiên đều xác nhận thấy chữ "nước 0" trước khi bắt đầu.

## Mâu thuẫn giữa các phiên, cần đối chiếu bằng ảnh

- **Nút "Gợi ý":** p04 (Bảo, 1440×900) báo nút bị khoá (disabled) suốt từ đầu tới cuối ván.
  p01 (Mai, 375×720) và p07 (ông Tám, 375×720) đều BẤM ĐƯỢC và nhận được nước đề xuất.
  Ba quan sát này không thể cùng đúng theo nghĩa đơn giản nhất — cần xem ảnh để kết luận.

## Cái không đo được trong lượt này

- Âm thanh. Console của MỌI phiên đều lặp lại cảnh báo
  `The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture`.
  Không phiên nào nghe được gì, nên không kết luận gì về âm thanh — đúng như `red-routes.md`
  đã loại trừ.
- Hiệu năng trên thiết bị thật. Đã loại khỏi phạm vi từ đầu.
