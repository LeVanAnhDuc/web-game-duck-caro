# ADR-0024 · `Side` là cái GHẾ; ai điều khiển ghế là một khái niệm riêng

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-17 · US-05 · ADR-0006 · ADR-0008

## 1. Bối cảnh

v1 có `Side = 'human' | 'ai'`. Kiểu đó gộp hai khái niệm vuông góc nhau vào một chỗ:
**ghế nào** (bên đi trước / bên đi sau — thuộc về ván cờ) và **ai điều khiển ghế đó**
(người hay máy — thuộc về chế độ chơi). Chừng nào chỉ có một chế độ thì hai thứ trùng
nhau nên không ai thấy vấn đề.

Hot-seat (FR-17) làm chúng tách ra: hai ghế, cả hai đều là người. Với kiểu cũ thì không
có cách nào diễn đạt điều đó mà không nói dối — hoặc một người phải mang nhãn `'ai'`,
hoặc mọi chuỗi hiển thị và mọi tiếng động phải kiểm thêm một cờ ở ngoài.

## 2. Quyết định

Tách làm ba kiểu:

```ts
type Side = 'one' | 'two';               // ghế. `core` chỉ biết tới cái này
type Controller = 'human' | 'engine';    // ai ngồi ghế đó
type Mode = Readonly<Record<Side, Controller>>;
```

`game/core` và `game/ai` **không đổi một dòng logic**: chúng vốn đã không quan tâm ghế
tên là gì. `Mode` sống ở tầng trên (`useGame` + `SavedGame`), và sau mỗi nước `useGame`
tra `mode[state.toMove]` để biết có phải gọi engine không. Đấu máy là
`{one: 'human', two: 'engine'}`, hot-seat là `{one: 'human', two: 'human'}`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `'human' \| 'ai'`, người thứ hai mang nhãn `'ai'` | Rẻ nhất và độc nhất. `strings.youLose`, `aiPlacedAt`, tiếng riêng cho từng bên, "Máy đang nghĩ…" — tất cả sẽ nói sai mà không có test nào đỏ, vì chúng đúng về kiểu |
| `Side = 'x' \| 'o'` | Đặt tên ghế theo HÌNH quân. Chết ngay ở FR-20: đổi bộ quân thì "bên X" không còn là X. Đó là buộc dữ liệu vào tầng render, đúng thứ ADR-0008 cấm |
| `Side = 'first' \| 'second'` | `createGame(first: Side)` sẽ đọc thành `first === 'second'` — một câu vô nghĩa ở đúng chỗ dễ đọc nhầm nhất |
| Thêm `Player` mang cả tên lẫn controller | Sinh ra khái niệm thứ tư mà glossary đã cấm chữ `Player`, và `core` sẽ phải biết về người chơi để chơi cờ |

## 4. Hệ quả

**Được:**

- `core` và `ai` thuần trở lại: chúng chơi cờ, không biết ai đang ngồi.
- Thêm chế độ về sau (máy đấu máy để tự kiểm mức khó) là thêm một `Mode`, không phải
  một nhánh mới trong luật.
- Mọi chuỗi hiển thị nhận tên ghế từ `Mode`, nên không còn chỗ nào nói "Máy" về một người.

**Mất / phải chấp nhận:**

- **Đổi cấu trúc ván lưu.** `Move.side` và `SavedGame.first` đổi giá trị, `SavedGame`
  thêm `mode`. Theo ADR-0006 thì `STORAGE_VERSION` lên `v2` và dữ liệu `v1` **bị bỏ,
  không migrate** — người đang có ván dở mất ván đó và mất thống kê. Chấp nhận vì v1
  chưa có người chơi thật; đây là lần cuối cùng cái giá đó còn rẻ.
- Commit mang `feat!:` → major bump (`CLAUDE.md` §Commit convention).
- `glossary.md` phải sửa dòng `Bên` và thêm hai dòng mới — tên gọi là thứ file đó khoá.

**Điều kiện xem lại quyết định này:** khi xuất hiện một ghế thứ ba (cờ ba người) —
lúc đó `Side` phải thành một danh sách chứ không phải một cặp, và `opponentOf` mất nghĩa.
