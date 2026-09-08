# Kế hoạch · Bàn phím, âm thanh, cài đặt

> **Cho người thực thi:** checkbox là phòng tuyến chống nén ngữ cảnh. Khi phiên bị nén
> giữa chừng, đây là thứ duy nhất nói được "đang ở task mấy trên mấy".

**Mục tiêu:** FR-14 · FR-15 · FR-16 lên được, và `NFR-A11Y-02` đạt lần đầu.

**Spec:** [`design.md`](design.md)

## Ràng buộc toàn cục

- `game/core` và `game/ai` **không đổi**.
- Chuỗi hiển thị chỉ ở `src/lib/strings.ts` (NFR-I18N-01).
- Không hex mới (`MASTER.md` §9). Vòng con trỏ dùng `--focus`, đã có trong `Palette`.
- Không thêm dependency nào. Âm thanh là WebAudio thuần (ADR-0021).
- Không request mạng nào (NFR-SEC-07) — kiểm bằng Network panel ở bước xem app thật.
- Test JSX chạy được nhờ `oxc.jsx` trong `vitest.config.mts` (đã có từ mốc 5).

---

### Task 1 · `ensureVisible` trong `render/camera`

**Files:** sửa `src/game/render/camera.ts` · test `src/game/render/camera.test.ts`

**Produces:** `ensureVisible(cam: Camera, at: Point, viewW: number, viewH: number): Camera`

Trả camera **y nguyên** khi ô đã nằm trọn trong khung nhìn; ngược lại dịch tối thiểu để
ô lọt vào, cộng một ô đệm.

- [ ] **B1.** Test trước:
  - ô ở giữa khung → camera trả về **cùng đối tượng tham chiếu** (`toBe`), không phải bản sao
  - ô lệch trái ngoài khung → `ox` tăng đúng lượng cần, `cell` không đổi
  - ô lệch phải / trên / dưới — mỗi chiều một ca
  - toạ độ âm
  - ô lệch cả hai chiều → dịch cả hai
  - khung nhỏ hơn một ô → không lặp vô hạn, không NaN
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực bằng `cellToScreen`, không tự nhân chia (bất biến 11).
- [ ] **B4.** Chạy → PASS. Commit: `feat(render): ensureVisible keeps a cell in view`

---

### Task 2 · `game/audio` (ADR-0021)

**Files:** tạo `src/game/audio/index.ts` · test `src/game/audio/index.test.ts`

**Produces:**
```ts
export type Sounds = {
  place(): void; reply(): void; win(): void; lose(): void;
  setEnabled(on: boolean): void;
  readonly available: boolean;
};
export function createAudio(ctor?: typeof AudioContext | undefined): Sounds;
```

`ctor` tiêm từ ngoài **chỉ để test** — mặc định đọc `window.AudioContext`.

- [ ] **B1.** Test trước, dùng một `AudioContext` giả ghi lại lời gọi:
  - `createAudio(undefined)` → `available === false`, và gọi cả bốn tiếng **không ném**
  - ctor ném lỗi → `available === false`, không ném ra ngoài
  - `place()` tạo oscillator, `start` và `stop` đều được gọi
  - `reply()` dùng **tần số khác** `place()` (phân biệt bằng cao độ, không âm lượng)
  - `setEnabled(false)` → không oscillator nào được tạo nữa
  - `AudioContext` chỉ được khởi tạo ở lời gọi ĐẦU TIÊN, không phải lúc `createAudio`
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Mọi lời gọi bọc `try {} catch {}` — im lặng, không nổ.
- [ ] **B4.** Chạy → PASS. Commit: `feat(audio): synthesised sounds, silence is valid (ADR-0021)`

---

### Task 3 · `game/settings` (ADR-0019)

**Files:** tạo `src/game/settings/settingsStore.ts` · test cùng thư mục ·
sửa `src/game/storage/keys.ts` (thêm `settingsKey()`)

**Produces:**
```ts
export type Settings = { readonly sound: boolean; readonly defaultLevel: Level };
export const DEFAULT_SETTINGS: Settings;
export function loadSettings(): Settings;
export function saveSettings(next: Settings): void;
```

- [ ] **B1.** Test trước, dùng `localStorage` giả:
  - chưa có gì → `DEFAULT_SETTINGS`
  - ghi rồi đọc → nguyên giá trị
  - JSON hỏng → `DEFAULT_SETTINGS`, **không ném** (NFR-REL-04)
  - `defaultLevel` không thuộc ba mức → `DEFAULT_SETTINGS`
  - `localStorage` ném khi ghi (chế độ ẩn danh) → `saveSettings` **không ném**
  - khoá là `gomoku:v1:settings`, **không** có `local` trong đó (ADR-0019)
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Dùng `safeStorage` đã có nếu vừa; nếu không thì `try/catch` tại chỗ.
- [ ] **B4.** Chạy → PASS. Commit: `feat(settings): settings live in their own seam (ADR-0019)`

---

### Task 4 · Chuỗi mới

**Files:** sửa `src/lib/strings.ts`

- [ ] **B1.** Thêm: `soundOn` · `settingsTitle` · `settingsSound` · `settingsDefaultLevel` ·
      `settingsClose` · `keyboardHelp` · `cursorAt(x,y)` · `cursorEmpty` · `cursorTakenYou` ·
      `cursorTakenAi` · `boardKeyboardLabel`. Commit cùng Task 7.

---

### Task 5 · Con trỏ bàn phím trong `useBoardCanvas` (ADR-0020)

**Files:** sửa `src/hooks/useBoardCanvas.ts` · test `src/hooks/useBoardCanvas.test.ts` (**mới**)

**Produces:** thêm vào `BoardCanvas`:
```ts
readonly cursor: Point | null;
onKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>): void;
```

- [ ] **B1.** Test trước (mount hook kiểu `useGame.test.ts`, dựng `KeyboardEvent` giả):
  - mũi tên phải → `cursor.x` tăng 1, `cam` có thể đổi nhưng `cell` không đổi
  - `Shift` + mũi tên phải → `cursor` **không đổi**, `cam.ox` giảm đúng một ô
  - `Enter` → gọi `onPlace` với đúng ô con trỏ
  - `Space` → như `Enter`, và `preventDefault` được gọi (không cuộn trang)
  - `+` / `-` → `cam.cell` đổi, kẹp trong `[CELL_MIN, CELL_MAX]`
  - `Home` → camera khớp `fitToMoves`
  - con trỏ đi ra ngoài khung → `cam` dịch theo (`ensureVisible`)
  - ván đã kết thúc → `Enter` **không** gọi `onPlace`
  - phím lạ (`q`) → không đổi gì, không ném
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Con trỏ khởi tạo ở nước cuối, hoặc `(0,0)` khi ván trống.
      `onKeyDown` **chỉ** xử lý phím nó biết và gọi `preventDefault` cho đúng những phím đó.
- [ ] **B4.** Chạy → PASS. Commit: `feat(hooks): keyboard cursor and board panning (ADR-0020)`

---

### Task 6 · `SettingsSheet` và `CursorLive`

**Files:** tạo `src/views/Home/mains/SettingsSheet/index.tsx` + test ·
tạo `src/views/Home/mains/CursorLive/index.tsx` + test

**`SettingsSheet` props:** `{ settings, onChange, onClearAll, onClose }`
**`CursorLive` props:** `{ cursor: Point | null; moves: readonly Move[] }`

- [ ] **B1.** Test `SettingsSheet` trước:
  - mỗi input có label liên kết (`htmlFor` khớp `id`) — NFR-A11Y-04
  - bật/tắt âm thanh gọi `onChange` với `sound` đảo lại
  - chọn mức gọi `onChange` với `defaultLevel` mới
  - nút xoá dữ liệu **hỏi xác nhận trước**, không xoá ngay
  - mọi nút ≥ 44px
- [ ] **B2.** Test `CursorLive` trước:
  - `cursor === null` → vùng rỗng, vẫn có `aria-live="polite"`
  - ô trống → đọc `Con trỏ ở 3, −2. Ô trống.`
  - ô có quân người chơi / quân máy → hai câu khác nhau
  - toạ độ âm dùng U+2212
- [ ] **B3.** Chạy cả hai → FAIL. Hiện thực. Chạy → PASS.
- [ ] **B4.** Commit: `feat(views): settings sheet and a live region for the cursor`

---

### Task 7 · Ghép vào `Home`

**Files:** sửa `src/views/Home/index.tsx` · `mains/Header/index.tsx` ·
`mains/BoardStage/index.tsx` · `mains/StartOverlay/index.tsx` · `src/lib/strings.ts` ·
`src/hooks/useSettings.ts` (**mới**)

- [ ] **B1.** `useSettings`: đọc một lần lúc mount, ghi mỗi lần đổi.
- [ ] **B2.** `BoardStage`: `tabIndex={0}`, `onKeyDown`, `aria-label` mới nói cả cách
      dùng bàn phím, vòng focus thấy được.
- [ ] **B3.** `Header`: nút loa phản ánh trạng thái thật (`soundOn`/`soundOff`) và bấm
      được; nút cài đặt mở `SettingsSheet`.
- [ ] **B4.** `Home`: nối `createAudio` vào các sự kiện — nước người chơi, nước máy,
      thắng, thua. Mức khó mặc định lấy từ cài đặt. `CursorLive` đặt cạnh `StatusLine`.
- [ ] **B5.** `StartOverlay`: bỏ nút xoá dữ liệu (đã chuyển sang cài đặt), mức khó khởi
      tạo từ `settings.defaultLevel`.
- [ ] **B6.** `yarn typecheck && yarn lint && yarn test && yarn build` → xanh hết.
- [ ] **B7.** Commit: `feat(views): keyboard play, sound and settings wired in`

---

### Task 8 · Xem app thật (bước không được bỏ)

- [ ] **B1.** Chơi **trọn một ván chỉ bằng bàn phím**, không chuột: Tab tới bàn, mũi tên,
      Enter, `Shift`+mũi tên, `+`/`-`, `Home`. Đây là tiêu chí `overview.md` §6 số 3.
- [ ] **B2.** Network panel: sau khi tải xong, chơi một ván → **không request nào**
      (NFR-SEC-07).
- [ ] **B3.** Chụp 375 · 768 · 1024 · 1440 cho màn cài đặt.
- [ ] **B4.** Nghe thật bốn tiếng, và kiểm tắt âm thì im.

---

### Task 9 · Tài liệu

- [ ] **B1.** `scope.md`: FR-14 · FR-15 · FR-16 → `xong`.
- [ ] **B2.** `invariants.md`: bất biến 5 viết lại thành **hai seam** (ADR-0019), nếu
      không nó tự thành câu sai.
- [ ] **B3.** `nfr.md`: `NFR-A11Y-02` ghi ngày đạt và cách đã kiểm. `NFR-PERF-08` ghi số
      mới vừa đo.
- [ ] **B4.** `README.md` §Features + §Controls (bảng phím) + số test. `CLAUDE.md` số test.
- [ ] **B5.** `MASTER.md`: nếu màn cài đặt cần token nào chưa có thì thêm ở đây kèm ADR,
      không nghĩ hex tại chỗ.
- [ ] **B6.** `backlog.md` §Đang làm.
- [ ] **B7.** Commit: `docs: milestone 6 — keyboard, sound, settings`

## Tự rà

Mọi mục `design.md` đều có task: §2 → Task 1+5 · §3 → Task 6 · §4 → Task 2+7 ·
§5 → Task 3+6+7 · §6 → Task 9-B2 · §7 → toàn bộ. Không có "TBD".
Tên hàm dùng ở Task 7 (`createAudio`, `loadSettings`, `ensureVisible`, `onKeyDown`)
đều được định nghĩa ở Task 1, 2, 3, 5.
