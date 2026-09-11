# Kế hoạch · v2 — hot-seat, luật thắng, giao diện, bộ quân

**Thiết kế:** [`design.md`](design.md) · **Nhánh:** `feat/v2-hotseat-rule-theme-pieces`

TDD từng task: test đỏ trước, rồi code. Đánh dấu `[x]` **ngay khi xong task đó** — đây là
thứ duy nhất còn lại nếu context bị nén giữa feature, và là cách phiên sau biết đang ở
task mấy trên mấy.

**Commit cuối cùng phải mang `feat!:`** — `SavedGame` đổi cấu trúc, dữ liệu `v1` bị bỏ
(ADR-0006 · ADR-0024). Đó là major bump theo `CLAUDE.md` §Commit convention.

---

## Nhóm 1 · Kiểu và lõi luật — 5 task

Không phụ thuộc gì. Mọi nhóm sau phụ thuộc nhóm này.

- [x] **1.1** `core/types.ts`: `Side = 'one' | 'two'`, thêm `Controller`, `Mode`, `Rule`,
      hằng `VS_AI` · `HOTSEAT`. Sửa `opponentOf`. Chưa sửa file nào khác — `yarn typecheck`
      sẽ đỏ ở ~7 file, đó là danh sách việc của nhóm 2–4.
- [x] **1.2** `core/rules.ts`: `winningLine(board, at, rule)`. Test **trước**: đoạn 5 bị
      chặn hai đầu → `null` ở `blocked`, → thắng ở `free`; đoạn 6 bị chặn hai đầu → cùng
      cặp kết quả đó (bất biến 3).
- [x] **1.3** `core/game.ts`: `createGame(first, rule)`, `applyMove` truyền `rule` xuống
      `winningLine`, `replay` giữ `rule`.
- [x] **1.4** `core/game.ts`: `undo(state, mode)` lùi **1** nước khi cả hai ghế là
      `human`, **2** nước khi có `engine`. Test cả hai.
- [x] **1.5** Chạy `yarn test` — 253 test cũ phải xanh lại sau khi đổi tên giá trị `Side`.
      Test nào phải sửa nội dung (không chỉ đổi tên) thì **ghi lại vì sao** ở commit body.

## Nhóm 2 · Engine biết luật — 4 task

Phụ thuộc nhóm 1. Làm sớm vì `NFR-PERF-06` phải đo lại và cần biết ngay nếu nhánh luật quá đắt.

- [x] **2.1** `ai/protocol.ts`: thêm `rule` vào thông điệp yêu cầu (bất biến 6).
- [x] **2.2** `ai/patterns.ts`: bảng mẫu nhận `rule`. Ở `free`, đoạn 5 bị chặn hai đầu
      chấm là **thắng**. Test trước, trên cả hai luật.
- [x] **2.3** `ai/evaluate.ts` + `ai/search.ts` + `ai/localEngine.ts` + `engine.worker.ts`:
      luồn `rule` xuống. Giữ độ sâu tiêm từ ngoài (bất biến 9).
- [x] **2.4** **Đo `NFR-PERF-06` cho cả hai luật**, ghi số thật vào `nfr.md`. Không viết
      con số nào chưa chạy ra. Nếu `free` vượt ngân sách → dừng, ghi vào `backlog.md`
      §Đang làm và bàn lại trước khi đi tiếp.

## Nhóm 3 · Lưu trữ v2 — 3 task

Phụ thuộc nhóm 1.

- [x] **3.1** `storage/keys.ts`: `STORAGE_VERSION = 'v2'`. Không viết hàm migrate nào
      (ADR-0006 · `design.md` §6).
- [x] **3.2** `storage/types.ts`: `SavedGame` thêm `mode` · `rule`, `first` đổi miền.
      `localGameRepository` kiểm **hình dạng** `mode`/`rule` và bỏ dữ liệu lạ — giống
      cách `settingsStore.parse` đang làm, không kiểm luật chơi.
- [x] **3.3** `settingsStore`: thêm `theme` · `pieceSet` · `defaultRule` vào `Settings`
      và vào `parse`. Giá trị lạ → **toàn bộ** về `DEFAULT_SETTINGS`, đúng hành vi hiện có.

## Nhóm 4 · `useGame` biết chế độ — 4 task

Phụ thuộc nhóm 1 · 2 · 3.

- [x] **4.1** `useGame(engine, {mode, rule, level})`. Sau mỗi nước: gọi engine **chỉ khi**
      `mode[state.toMove] === 'engine'` (bất biến 15).
- [x] **4.2** `place()` bỏ điều kiện `toMove !== 'human'`; thay bằng "ghế đang đi có
      controller là `human`". Giữ lớp chặn double-tap của `NFR-REL-02`.
- [x] **4.3** `restart`, `resetToMenu`, `resume` mang theo `mode` · `rule`. `resume` một
      ván hot-seat **không** được gọi engine (US-05 §Điều gì có thể sai).
- [x] **4.4** Test: ván hot-seat 4 nước không gọi engine lần nào (engine giả, đếm số lần
      gọi = 0). Đây là test giữ bất biến 15.

## Nhóm 5 · Giao diện và bộ quân — 5 task

**Độc lập với nhóm 1–4**, chạy song song được.

- [x] **5.1** `globals.css`: ba tầng token theo `design.md` §3, đúng thứ tự. `color-scheme`
      đi theo `data-theme`.
- [x] **5.2** `app/layout.tsx`: script inline trong `<head>` đặt `data-theme` trước lần vẽ
      đầu. Bọc `try/catch` — `localStorage` bị chặn thì im lặng về `system`.
- [x] **5.3** `render/palette.ts`: đổi `markHuman`/`markAi` → `markOne`/`markTwo`; đổi tên
      biến trong `globals.css` và `MASTER.md` §1 §2 cho khớp. Giá trị hex **không đổi**.
- [x] **5.4** `useBoardCanvas`: `MutationObserver` trên `data-theme` + listener
      `prefers-color-scheme` → vẽ lại. Test: đổi thuộc tính → hàm vẽ được gọi lại.
- [x] **5.5** `render/layers/marks.ts`: bảng tra `SETS` cho bốn bộ. Test: mỗi bộ vẽ ra
      đúng số path mong đợi cho từng ghế; không bộ nào đặt `strokeStyle` ngoài
      `markOne`/`markTwo` (bất biến 16).

## Nhóm 6 · UI — 4 task

Phụ thuộc nhóm 4 · 5. Bố cục theo mockup đã duyệt (canvas Artifact, không lưu trong repo).

- [x] **6.1** `components/SeatBar` — thay phần "lượt của ai" của `StatusLine`. Cả hai
      chế độ, gồm trạng thái "Máy đang nghĩ…". `StatusLine` đã **xoá**, nhưng phần
      `aria-live` của nó tách thành `components/NoticeLine` chứ không biến mất —
      mockup không vẽ dòng đó, mà bỏ nó là mất phản hồi "Ô đó đã có quân" cho người
      nhìn bằng mắt. Chỗ lệch này đã nói ra.
- [x] **6.2** `mains/StartOverlay`: mục Chế độ trên cùng, mục Luật kèm dòng ⓘ đổi theo
      lựa chọn, ẩn Mức khó khi hot-seat, nhãn "Ai đi trước" đổi theo chế độ.
- [x] **6.3** `mains/SettingsSheet`: mục Giao diện (3), mục Bộ quân (4 ô **vẽ hình thật**,
      không phải tên), mục Luật mặc định. Nhãn liên kết `htmlFor`/`id` — `NFR-A11Y-04`.
- [x] **6.4** Quân xem trước ở con trỏ mang hình + màu của **bên đang đi** (ADR-0028).
      ~~Đổi chế độ giữa ván → hỏi xác nhận~~ → **không làm**: chế độ và luật đông cứng
      theo ván (bất biến 14), nên không có nút nào đổi chúng giữa ván. Muốn đổi thì bỏ
      ván rồi bắt đầu ván mới — đi qua đúng luồng US-04. Một hộp xác nhận ở đây là con
      đường thứ hai tới cùng một chỗ.

## Nhóm 7 · Kiểm và đo — 6 task

- [x] **7.1** `lib/strings.ts`: rà `grep` mọi chuỗi còn giả định đối thủ là máy. Sửa
      `appTagline`. `NFR-I18N-01` — không chuỗi nào rơi ra ngoài file này.
- [x] **7.2** `yarn typecheck` · `yarn lint` · `yarn test` xanh. Cập nhật số test trong
      `README.md` §Tech Stack.
- [x] **7.3** E2E mới: chơi trọn một ván hot-seat; engine **không** được gọi.
- [x] **7.4** E2E mới cho `NFR-PERF-10`: đặt theme `dark`, tải bản build tĩnh, đọc
      `data-theme` ở `document-start`. Trên **bản build**, không dev server (ADR-0022).
- [x] **7.5** `NFR-A11Y-07`: chụp bàn ở 16px cho cả bốn bộ, xám hoá, nhìn tận mắt, ở cả
      hai giao diện. Bộ nào không đạt thì **bỏ bộ đó** và ghi lý do vào ADR-0027.
- [x] **7.6** Bước 5 của flow: chạy app thật, chụp ở 375 / 768 / 1024 / 1440, thử hover ·
      focus · bàn phím · đổi theme · đổi bộ quân. Lệch mockup thì nói ra **trong hội
      thoại** và cập nhật canvas.

## Nhóm 8 · Chốt — 4 task

- [x] **8.1** `README.md` §Features: bốn bullet tiếng Anh, đúng style và nhóm đang có
      (`CLAUDE.md` §README — bắt buộc cùng nhánh).
- [x] **8.2** `backlog.md`: §Đang làm ghi trạng thái thật; §Nợ kỹ thuật thêm hai dòng
      (hot-seat không vào thống kê · hai luật đổ chung ô).
- [x] **8.3** `docs/README.md` + `decisions/README.md`: **không sửa tay** trong khối
      `BEGIN:auto` — sửa header `**Trạng thái:**` của từng file rồi để `docs-regen.sh` sinh.
- [ ] **8.4** `requesting-code-review` → `verification-before-completion` →
      `finishing-a-development-branch`.

---

## Chỗ có thể phải dừng và bàn lại

Ghi trước để không phải quyết một mình lúc đang giữa việc:

| Nếu | Thì |
| --- | --- |
| `NFR-PERF-06` ở luật `free` vượt ngân sách mức Khó | Dừng ở task 2.4. Bàn lại: nới ngân sách, hay hạ độ sâu riêng cho `free` |
| Bộ `duck` không đạt `NFR-A11Y-07` | Bỏ bộ đó, ghi vào ADR-0027 §Hệ quả. Không sửa màu để cứu nó (bất biến 16) |
| 253 test cũ cần sửa **nội dung**, không chỉ đổi tên | Dừng, xem lại nhóm 1 — có thể lõi đã bị đổi hành vi ngoài ý muốn |
| Sheet cài đặt ở 375 cuộn quá dài | Bàn lại thứ tự mục, không tự bỏ mục nào |
