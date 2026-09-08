# ADR-0019 · Cài đặt có seam lưu trữ riêng, không đi qua `GameRepository`

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-16 · NFR-REL-04 · ADR-0006

## 1. Bối cảnh

Bất biến 5 cấm UI gọi `localStorage` trực tiếp: mọi truy cập đi qua `GameRepository`, để
ngày ghép Ducker ID không còn mảnh dữ liệu nào nằm lại trên máy mà không ai biết.

Nhưng `GameRepository.ts` — viết từ mốc 4, trước khi có FR-16 — đã ghi thẳng rằng cài đặt
**không** thuộc về nó: *"nó là thuộc tính của cái máy đang ngồi, không phải của người.
Đồng bộ nó theo tài khoản sẽ làm tắt tiếng ở máy công ty thì máy nhà cũng im."*

Hai câu đó chỉ cùng đúng nếu có một seam thứ hai.

## 2. Quyết định

`game/settings/settingsStore.ts`, với `loadSettings(): Settings` và
`saveSettings(next: Settings): void`. **Đồng bộ**, khác `GameRepository` vốn async từ v1
(ADR-0006) — vì cài đặt sẽ không bao giờ đi qua mạng, nên `Promise` ở đây là lớp bọc
không có seam nào bên dưới.

Khoá là `gomoku:v1:settings`: dùng `STORAGE_VERSION` của `keys.ts` nhưng **không** có
tiền tố chủ sở hữu. Việc nằm ngoài `prefixFor(owner)` chính là điều làm nó thuộc về máy.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Nhét cài đặt vào `GameRepository` | Trái với chính lý lẽ đã ghi trong file đó. Và nó biến `GameRepository` thành "chỗ chứa mọi thứ cần lưu", tức không còn là seam danh tính nữa. |
| Cho UI gọi `localStorage` trực tiếp, coi cài đặt là ngoại lệ | Phá bất biến 5 bằng một ngoại lệ không có ranh giới rõ. Ngoại lệ thứ hai sẽ đến, và không ai còn biết dữ liệu nằm ở đâu. |
| Async cho giống `GameRepository` | Đối xứng bề mặt, sai bản chất: seam async tồn tại vì dữ liệu ván **sẽ** đi remote. Cài đặt thì không, nên async chỉ thêm `await` mà không mua được gì. |

## 4. Hệ quả

**Được:**

- Bất biến 5 vẫn đúng nguyên văn: UI không gọi `localStorage`, nó gọi một trong **hai** seam.
- Tắt tiếng ở máy này không làm im máy khác, kể cả sau khi có đăng nhập.

**Mất / phải chấp nhận:**

- Hai seam lưu trữ thay vì một, nên câu "dữ liệu game nằm ở đâu" có hai câu trả lời.
  `clearAll` của `GameRepository` xoá theo tiền tố `gomoku:` nên nó **vẫn** dọn cả cài
  đặt — đó là chủ ý, và là chỗ duy nhất hai seam gặp nhau.
- Bất biến 5 phải được viết lại để nói "hai seam", nếu không nó tự thành câu sai.

**Điều kiện xem lại quyết định này:** khi có một cài đặt thật sự thuộc về NGƯỜI chứ không
thuộc về máy (ví dụ tên hiển thị) — cái đó thuộc `GameRepository`, không thuộc đây.
