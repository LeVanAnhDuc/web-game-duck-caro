# Thiết kế · E2E Playwright và đo `NFR-PERF-09`

**Liên quan:** NFR-PERF-09 · NFR-A11Y-02 · NFR-REL-04 · NFR-SEC-07 · US-01 · US-02 ·
US-03 · US-04 · FR-11 · ADR-0001 · ADR-0005 · ADR-0010 · ADR-0022

Mốc 7. Không thêm chức năng người dùng nào — mốc này **kiểm** những gì sáu mốc trước
đã làm, và điền con số cuối cùng còn trống trong `nfr.md`.

---

## 1. Vì sao cần E2E khi đã có 253 unit test

253 test kia kiểm **từng mảnh**. Không cái nào kiểm được ba thứ:

1. **Worker chạy thật.** Mọi test về AI đều tiêm một `Engine` giả. Chưa test nào chứng
   minh `engine.worker.ts` khởi động được, nhận đúng thông điệp, và trả nước trong một
   trình duyệt thật. Nếu `workerEngine` gửi sai hình dạng thông điệp, cả 253 test vẫn
   xanh và game thì không đánh được nước nào.
2. **`localStorage` thật.** `usePersistence` được test với storage giả. Ván sống qua
   một lần **tải lại trang thật** thì chưa ai kiểm bằng máy.
3. **Bàn phím trong cây focus thật.** `nfr.md` §NFR-A11Y-02 đã hứa "một test E2E", và
   mốc 6 cho thấy vì sao: cây focus ở dev server **khác** cây focus ở production.

## 2. E2E chạy trên BẢN BUILD TĨNH, không trên dev server — ADR-0022

Đây là quyết định chịu lực của mốc này, và nó đến từ một lỗi thật gặp ở mốc 6: overlay
dev-tools của Next là **một phần tử trong thứ tự Tab**. Đo a11y trên dev server là đo
một cây focus không tồn tại ở production — lần đầu thử, `Tab` từ canvas nhảy vào
`NEXTJS-PORTAL`.

Nên: `yarn build` → phục vụ `out/` → chạy test. Đúng cái sẽ lên GitHub Pages (ADR-0001).

Giá phải trả: mỗi lần chạy E2E kèm một lần build (~35s). Chấp nhận, vì cái rẻ hơn là
cái đo sai.

## 3. Tính lặp lại

Ba nguồn bất định, và cách xử từng cái:

| Nguồn | Cách xử |
| --- | --- |
| Nước của máy | RNG **seed cố định** (`ENGINE_SEED = 1`) từ mốc 2, ADR-0005. Cùng thế bàn ra cùng nước. |
| Thời gian máy nghĩ | **Không dùng `waitForTimeout`.** Chờ trên trạng thái UI (`nước n` đổi, dòng trạng thái đổi). Mức Khó tốn tới 1.5s và CI chậm hơn máy dev. |
| Dữ liệu còn sót từ test trước | Mỗi test một `context` mới, nên `localStorage` sạch. Test nào cần dữ liệu cũ thì tự dựng. |

**Test chạy ở mức Dễ trừ khi đang kiểm chính mức khó.** Mức Dễ trả nước trong ~8ms
(`NFR-PERF-06`), nên một ván 10 nước tốn dưới một giây thay vì mười lăm giây.

## 4. Những gì E2E kiểm, và luồng nào nó phủ

| Test | Phủ | Điều nó bắt được mà unit test không bắt |
| --- | --- | --- |
| Chơi vài nước, máy đáp lại | US-01 · FR-04 | Worker khởi động và trả nước thật |
| Chơi trọn một ván **chỉ bằng bàn phím** | NFR-A11Y-02 · FR-15 | Canvas nằm trong cây focus thật của bản build |
| Tải lại trang giữa ván | US-02 · FR-11 | `localStorage` thật, và `replay` dựng lại đúng |
| Xem lại ván đã kết thúc | US-03 · FR-08 · FR-09 | Bàn vẽ `moves.slice`, và nét thắng chỉ hiện ở nước cuối |
| Đổi cài đặt rồi tải lại | US-04 · FR-16 | Seam cài đặt (ADR-0019) ghi và đọc thật |
| Không request nào ra ngoài origin | NFR-SEC-07 | Đo bằng máy, không bằng mắt nhìn Network panel |
| Cửa sổ chặn `localStorage` | NFR-REL-04 | App còn chạy khi storage ném |

**Không** kiểm bằng E2E: luật thắng, lượng giá AI, hình vẽ trên canvas. Ba thứ đó đã có
unit test, và kiểm lại chúng qua trình duyệt là chậm hơn 100 lần mà không chắc hơn.

## 5. `NFR-PERF-09` — ngưỡng chốt SAU khi đo

`nfr.md` cố ý để trống ô này với ghi chú "chưa đo, chưa có ngưỡng". Mốc này chạy
Lighthouse với throttling 4G trên bản build tĩnh, **rồi mới** chốt ngưỡng từ con số
thật — đúng thứ tự mà `nfr.md` yêu cầu, và ngược với thói quen viết một con số nghe
hợp lý rồi đi tìm cách đạt nó.

Ngưỡng sẽ được viết dưới dạng "≤ giá trị đo được cộng một khoảng dư", và ghi rõ ngày,
công cụ, cấu hình throttling.

## 6. Ranh giới

```
e2e/                     specs Playwright. KHÔNG nằm trong `src/`, nên
                         `vitest.config.mts` (include `src/**/*.test.ts`) không thấy nó
playwright.config.ts     webServer = build + serve out/
```

Không file nào trong `src/` bị sửa vì mốc này. Nếu phải sửa `src/` để E2E chạy được,
đó là dấu hiệu app đang thiếu một `aria-label` hay một tên gọi ổn định — và **sửa cái
đó** mới đúng, không phải bám vào selector CSS dễ vỡ.

## 7. Không làm trong mốc này

- **Không chạy E2E trên nhiều trình duyệt.** Chỉ Chromium. Ba trình duyệt là ba lần
  thời gian CI cho một sản phẩm chưa có người chơi thật.
- **Không test ảnh (visual regression).** Canvas vẽ khác nhau theo nền tảng ở mức
  sub-pixel, nên ảnh so ảnh sẽ đỏ ngẫu nhiên — đúng cái mà bất biến 10 cảnh báo.
- **Không đo `NFR-PERF-05` / `NFR-PERF-07` trên điện thoại thật.** Không có thiết bị.
  Việc đó **ở lại backlog**, và ghi rõ là chưa làm chứ không lặng lẽ coi như xong.
