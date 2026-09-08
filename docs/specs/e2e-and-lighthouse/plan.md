# Kế hoạch · E2E và đo `NFR-PERF-09`

> **Ghi chú trung thực:** file này được viết **trong lúc** làm, không phải trước. Mốc 7
> không có bước nào cần chờ kết quả bước trước để biết phải làm gì — danh sách việc đã
> nằm sẵn trong [`design.md`](design.md) §4 dưới dạng một bảng. Ghi lại ở đây để hợp đồng
> tài liệu (`docs/README.md`) không có một feature thiếu `plan.md`, và để lần sau ai đọc
> biết mốc này gồm những gì.

**Mục tiêu:** 19 test E2E trên bản build tĩnh, một job CI riêng, và ô `NFR-PERF-09` được
điền bằng số đo thật.

**Spec:** [`design.md`](design.md) · **Quyết định:** ADR-0022

## Ràng buộc toàn cục

- `src/` **không đổi một dòng nào**. Phải sửa `src/` để E2E chạy được nghĩa là app đang
  thiếu một tên gọi ổn định — sửa cái đó, không bám vào selector CSS dễ vỡ.
- Không `waitForTimeout`. Chờ trên trạng thái UI.
- Test chạy mức **Dễ** trừ khi đang kiểm chính mức khó (~8ms/nước thay vì ~1.2s).
- Không đọc biến môi trường: `.env.example` tuyên bố dự án không có biến nào, và
  `docs-regen.sh` đối chiếu điều đó với code.

---

### Task 1 · Hạ tầng E2E ✅

- [x] `yarn add -D @playwright/test`, `npx playwright install chromium`
- [x] `e2e/serve-out.mjs` — phục vụ `out/` tĩnh, viết tay thay vì thêm dependency.
      Cổng lấy từ **argv**, không từ biến môi trường.
- [x] `playwright.config.ts` — `webServer` = `yarn build && node e2e/serve-out.mjs`
      (ADR-0022). Chỉ Chromium.
- [x] `e2e/helpers.ts` — `cellPosition`, `playAt`, `expectMoves`, `tabToCanvas`,
      `startGame`, `panelButton`
- [x] Script `yarn e2e`; `.gitignore` thêm `test-results/`, `playwright-report/`

### Task 2 · Các spec ✅

- [x] `play.spec.ts` (5) — Worker chạy thật, ô đã có quân, hoàn nước, gợi ý, máy đi trước
- [x] `keyboard.spec.ts` (5) — canvas trong thứ tự Tab, chơi trọn ván bằng bàn phím,
      vùng live của con trỏ, Shift+mũi tên, phím lạ không chặn Tab
- [x] `persistence.spec.ts` (5) — reload giữa ván, ván kết thúc, cài đặt sống qua reload,
      xoá cả hai seam, `localStorage` bị chặn
- [x] `review-and-network.spec.ts` (4) — xem lại, nút Giữa trong xem lại, không request
      ra ngoài origin, thống kê chỉ đếm một lần

### Task 3 · CI ✅

- [x] Job `e2e` **riêng**, song song với `check`. Không gộp: nó cần tải một trình duyệt
      (~150MB) và một lần build, nên gộp lại làm typecheck và lint phải chờ khoản đó
      trước khi báo lỗi đầu tiên.
- [x] Upload `playwright-report/` khi đỏ.

### Task 4 · Đo `NFR-PERF-09` ✅

- [x] `e2e/measure-load.mjs` — Slow 4G (1.6 Mbps · 750 Kbps · RTT 150ms) + CPU ×4,
      khung 412×915 dpr 2, lấy **trung vị** của nhiều lần chạy.
- [x] Đếm byte bằng CDP `Network.loadingFinished`, **không** bằng header
      `content-length` — cách dùng header trả về 0 khi server không gửi header đó, và
      một con số sai trông y như một con số đúng. Đây là lỗi đã mắc thật trong lát này.
- [x] Chạy 5 lần: LCP **1.00s** · load **3.17s** · **526 kB**, lần nào cũng chơi được ngay.
- [x] Chốt ngưỡng **sau** khi đo: LCP ≤ 2.5s (biên "good" của Core Web Vitals),
      load ≤ 4.5s, truyền ≤ 700 kB.

### Task 5 · Tài liệu ✅

- [x] `nfr.md` — `NFR-PERF-09` điền số và ngưỡng; `NFR-A11Y-02` trỏ tới file test thật;
      header đổi vì ô "chưa đo" cuối cùng đã được điền
- [x] `README.md` — Commands, Tech Stack, Status "all 7 milestones"
- [x] `CLAUDE.md` — `yarn e2e`, bảng cổng workflow, và vì sao không chạy trên dev server
- [x] `backlog.md` — mốc 7 xong; còn lại là những việc **cần người hoặc thiết bị**
- [x] ADR-0022

## Không làm, và vì sao

- **Đo trên điện thoại thật** (`NFR-PERF-05` · `NFR-PERF-07`): không có thiết bị. Ở lại
  backlog với ưu tiên cao, ghi rõ là chưa làm.
- **Visual regression trên canvas**: khác nhau ở mức sub-pixel theo nền tảng, nên ảnh so
  ảnh sẽ đỏ ngẫu nhiên — đúng cái mà bất biến 10 cảnh báo.
- **Nhiều trình duyệt**: ba lần thời gian CI cho một sản phẩm chưa có người chơi thật.
