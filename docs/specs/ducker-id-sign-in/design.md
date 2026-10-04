# Thiết kế · Đăng nhập Ducker ID (tuỳ chọn, sau cờ)

**Liên quan:** FR-21 · US-07 · NFR-SEC-07 · NFR-DATA-01 · NFR-I18N-01 · NFR-A11Y-02 · ADR-0029
**Spec chung:** `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`

## Vị trí và dáng

`Header` (`src/views/Home/mains/Header`), giữa chip mức khó và nút âm thanh. Chưa đăng
nhập: nút chữ theo `.btn-secondary` của `docs/design-system/gomoku/MASTER.md` (nền
`--paper-raised`, viền `--border`, cao 44px, bo 6px; dưới 420px ẩn icon để vừa 375px). Đã
đăng nhập: avatar tròn 32px (ảnh hoặc chữ cái đầu trên `--ink-strong`) trong vùng bấm
44px. Menu: bottom sheet (`--shadow-sheet`, bo 10px) dưới `md`, popover (`--shadow-panel`)
từ 768px. Chỉ biến CSS và Lucide, không màu mới.

## Chuỗi (NFR-I18N-01, `src/lib/strings.ts`)

Đăng nhập · Đang đăng nhập… · Tài khoản Ducker ID · Mở hồ sơ Ducker ID · Đăng xuất.

## Tệp

- `src/lib/ducker/{types,config,pkce,auth,requests,session,initials}.ts` + test
- `src/hooks/{useDuckerAuth,useAccountMenu}.ts`
- `src/views/Home/components/AccountButton/index.tsx` + test
- `e2e/{build-all.mjs,ducker-id-sign-in.spec.ts,ducker-id-flag-off.spec.ts}`; Playwright
  có thêm server `out-auth` ở cổng 3301 (cờ bật, issuer giả `http://ducker.test`)

## Ngoại lệ NFR

NFR-SEC-07: sessionStorage khoá `ducker.pkce` (xoá khi quay về); mạng chỉ tới issuer đã
cấu hình và tới URL ảnh đại diện nó trả về, chỉ sau khi đăng nhập; cờ tắt thì không có gì. Test mạng của game giữ
nguyên trên bản cờ tắt.

## Hành vi

Bàn phím: Esc đóng và trả focus; mũi tên/Home/End di chuyển giữa mục; Tab đóng không kéo
focus lại; đăng xuất đặt focus lên nút Đăng nhập. Lỗi IdP, `state` sai, quá 15s hoặc
userinfo sai hình dạng đều về chưa đăng nhập, im lặng. Callback khôi phục `returnTo` (chỉ
đường dẫn cùng origin, không `//` hay `\`).
