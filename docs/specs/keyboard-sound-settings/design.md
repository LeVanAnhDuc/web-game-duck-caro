# Thiết kế · Bàn phím, âm thanh, cài đặt

**Liên quan:** FR-14 · FR-15 · FR-16 · US-01 · US-02 · US-04 · NFR-A11Y-02 · NFR-A11Y-04 ·
NFR-A11Y-05 · NFR-A11Y-06 · NFR-REL-04 · NFR-DATA-04 · NFR-SEC-07 · NFR-I18N-01 ·
ADR-0006 · ADR-0007 · ADR-0009 · ADR-0019 · ADR-0020 · ADR-0021

Mốc 6. Ba chức năng này đi chung một tài liệu vì cả ba đều là **thuộc tính của cái máy
đang ngồi**, không phải của ván đấu: bàn phím là cách nhập, âm thanh là đầu ra, cài đặt
là chỗ tắt bật hai thứ đó.

---

## 1. Vì sao mốc này quan trọng hơn vẻ ngoài của nó

`NFR-A11Y-02` nói: **mọi** hành động thao tác được bằng bàn phím, *kể cả đánh quân và
di chuyển bàn*. Đây là ngưỡng duy nhất trong `nfr.md` mà bốn mốc đầu **không hề đạt**
— bàn cờ là canvas, và canvas không có gì để tab tới. `overview.md` §6 còn đặt "chơi
trọn một ván chỉ bằng bàn phím" làm một trong ba tiêu chí thành công.

Nói khác đi: tới hết mốc 5, game này **không chơi được nếu không có chuột hoặc cảm ứng**.
Mốc 6 là mốc sửa điều đó.

## 2. Con trỏ bàn phím (FR-15) — ADR-0020

Bàn vô hạn không có danh sách ô để tab qua, nên phải có một **con trỏ**: một ô đang được
trỏ tới, vẽ bằng `drawCursorRing` (đã có trong `overlay.ts` từ mốc 3, chưa ai gọi).

| Phím | Việc |
| --- | --- |
| `←` `→` `↑` `↓` | dịch con trỏ **một ô** |
| `Enter` · `Space` | đánh vào ô con trỏ |
| `Shift` + mũi tên | **kéo bàn** một ô, con trỏ đứng yên trên màn hình |
| `+` `-` | thu phóng |
| `Home` | về giữa (bằng nút "Giữa") |
| `h` | gợi ý |
| `u` | hoàn nước |

Ba điều bắt buộc, và cả ba đều là chỗ **sai âm thầm** nếu làm sai:

1. **Con trỏ phải KÉO KHUNG NHÌN theo nó.** Bàn vô hạn nghĩa là con trỏ đi ra khỏi màn
   hình sau chục lần bấm, và lúc đó vòng con trỏ vẫn "tồn tại" — chỉ là không ai thấy.
   Cần một hàm thuần `ensureVisible(cam, at, w, h)` trong `render/camera` (bất biến 11:
   mọi phép đổi toạ độ đi qua đúng module đó).
2. **Con trỏ bắt đầu ở đâu có nghĩa.** Ván trống → ô `(0,0)`. Ván đang chơi → ô của
   **nước cuối**, vì đó là chỗ người chơi đang nghĩ.
3. **Canvas phải nhận được focus.** `tabIndex={0}` cộng một vòng focus thấy được. Không
   có nó thì mọi phím ở trên đều đúng mà không bao giờ chạy.

`Shift` + mũi tên là cách trả lời phần "di chuyển bàn" của `NFR-A11Y-02` mà **không** cần
một chế độ riêng. Chế độ riêng ("bấm P để vào chế độ kéo bàn") là thứ người dùng không
biết mình đang ở trong đó — và trên bàn vô hạn, không biết mình đang ở chế độ nào nghĩa
là mỗi phím mũi tên làm một trong hai việc hoàn toàn khác nhau.

## 3. `aria-live` (FR-15 · NFR-A11Y-06)

Đã có **một** vùng `role="status" aria-live="polite"` trong `StatusLine` từ mốc 2, và nó
đọc từng nước kèm toạ độ. Mốc 6 thêm **một vùng thứ hai, riêng cho con trỏ**.

Vì sao phải là hai vùng: nếu vị trí con trỏ đi vào cùng vùng với thông báo nước đi, thì
mỗi lần bấm mũi tên sẽ ghi đè lên "Máy đánh ở 3, −2" — tức là bấm bàn phím làm **mất**
thông báo mà chính người dùng bàn phím cần nhất. Hai vùng, hai nhiệm vụ:

- vùng cũ: nước đi, kết quả ván, gợi ý — **sự kiện**
- vùng mới: `Con trỏ ở 3, −2. Ô trống.` / `Ô đã có quân của bạn.` — **trạng thái**

Vùng con trỏ đọc kèm **tình trạng ô**, vì người không thấy bàn cần biết ô đó trống hay
không *trước* khi bấm Enter, chứ không phải sau.

## 4. Âm thanh (FR-14) — ADR-0021

**Tổng hợp bằng WebAudio, không một file nào.** Đây là ràng buộc cứng, không phải thẩm
mỹ: `NFR-SEC-07` cấm mọi request mạng sau lần tải đầu, và một file `.mp3` là một request.

Bốn tiếng, mỗi tiếng là một oscillator ngắn + envelope:

| Tiếng | Khi nào | Hình dáng |
| --- | --- | --- |
| `place` | người chơi đánh | click ngắn, cao |
| `reply` | máy đánh | click ngắn, thấp hơn — phân biệt bằng CAO ĐỘ, không bằng âm lượng |
| `win` | người chơi thắng | ba nốt đi lên |
| `lose` | người chơi thua | hai nốt đi xuống |

Ba điều bắt buộc:

1. **`AudioContext` tạo LÚC CÓ CỬ CHỈ NGƯỜI DÙNG ĐẦU TIÊN, không lúc mount.** Trình
   duyệt chặn context tạo trước cử chỉ, và một context bị chặn ở trạng thái `suspended`
   vĩnh viễn — im lặng mãi mãi mà không lỗi nào nổ ra.
2. **Im lặng là một trạng thái HỢP LỆ.** `journeys.md` §US-01 ghi rõ: "Trình duyệt chặn
   âm thanh — phải im lặng, không được vỡ". Mọi lời gọi bọc trong `try`, và
   `AudioContext` không tồn tại thì module trả về một bản **không làm gì**, không phải
   `null` mà người gọi phải kiểm.
3. **Âm thanh KHÔNG được nằm trong `game/core` hay `game/ai`** (bất biến 4). Nó là một
   module ngang hàng `render`: `game/audio/`.

## 5. Cài đặt (FR-16) — ADR-0019

`GameRepository.ts` đã ghi sẵn, từ mốc 4, rằng cài đặt **không** đi qua nó: *"nó là thuộc
tính của cái máy đang ngồi, không phải của người. Đồng bộ nó theo tài khoản sẽ làm tắt
tiếng ở máy công ty thì máy nhà cũng im."*

Nhưng bất biến 5 cấm UI gọi `localStorage` trực tiếp. Hai câu đó chỉ cùng đúng khi có
**một seam thứ hai**: `game/settings/SettingsStore.ts`, đồng bộ (khác `GameRepository`),
vì nó sẽ không bao giờ đi qua mạng.

```
loadSettings(): Settings
saveSettings(next: Settings): void
```

Nội dung cài đặt ở v1, đúng ba mục và không hơn:

| Mục | Giá trị | Vì sao có |
| --- | --- | --- |
| Âm thanh | bật / tắt | FR-14 cần một chỗ tắt |
| Mức khó mặc định | Dễ · Thường · Khó | US-04: người chơi mức Khó không muốn chọn lại mỗi ván |
| Xoá toàn bộ dữ liệu | nút | NFR-DATA-04, chuyển từ `StartOverlay` sang đây cho đúng chỗ |

**Khoá lưu dùng lại `keys.ts` nhưng KHÔNG có tiền tố chủ sở hữu.** `prefixFor(owner)`
gắn `local` hôm nay và id người dùng sau này; cài đặt cố ý nằm ngoài cơ chế đó, ở
`gomoku:v1:settings`. Đó chính là điều khiến nó là thuộc tính của máy.

Dữ liệu hỏng hoặc `localStorage` bị chặn → **về mặc định, im lặng** (NFR-REL-04). Cài đặt
mất là mất một lựa chọn nhỏ; không được phép làm app không mở được.

## 6. `prefers-reduced-motion` (NFR-A11Y-05)

`globals.css` đã tắt animation khi bật thiết lập đó, nhưng camera hiện **không** có
animation nào — nó nhảy thẳng. Nên `NFR-A11Y-05` đạt sẵn ở phần camera, và mốc này
không được thêm chuyển động nào không kiểm thiết lập đó. Ghi ra để lần sau ai thêm
animation trượt camera thì biết mình đang phá cái gì.

## 7. Ranh giới module

| Tầng | Thêm gì |
| --- | --- |
| `game/render/camera` | `ensureVisible(cam, at, w, h)` — hàm thuần |
| `game/audio/` | **module mới**: `createAudio()`, tổng hợp WebAudio, im lặng được |
| `game/settings/` | **module mới**: `Settings`, `loadSettings`, `saveSettings` |
| `hooks/useBoardCanvas` | con trỏ, xử lý phím, focus |
| `hooks/useSettings` | đọc/ghi cài đặt |
| `views/Home/mains/SettingsSheet` | component mới |
| `views/Home/mains/CursorLive` | vùng `aria-live` thứ hai |

`game/core` và `game/ai` **không đổi một dòng nào** — cùng phép thử như mốc 5.

## 8. Không làm trong mốc này

- **Không có phím tắt tuỳ chỉnh.** Không FR nào yêu cầu, và nó cần một màn hình nữa.
- **Không có âm lượng dạng thanh trượt** — chỉ bật/tắt. Một thanh trượt cần lưu số, cần
  nhãn, cần test biên; giá trị thêm gần bằng không.
- **Không đọc toàn bộ thế bàn ra `aria-live`.** Trên bàn vô hạn đó là một câu vô hạn.
  Vùng con trỏ đọc từng ô là cách đúng.
- **Không có chế độ tương phản cao.** Palette đã đạt 4.5:1 (`MASTER.md` §1–2).
