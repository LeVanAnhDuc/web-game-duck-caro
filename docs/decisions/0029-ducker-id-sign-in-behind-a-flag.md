# ADR-0029 · Đăng nhập Ducker ID tuỳ chọn, chỉ định danh, sau cờ và tắt ở bản deploy

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-21 · US-07 · NFR-SEC-07 · NFR-DATA-01 · ADR-0006 · ADR-0010

## 1. Bối cảnh

Yêu cầu của chủ dự án 2026-10-04: mọi game trong workspace có "Đăng nhập bằng Ducker ID"
tuỳ chọn như `web-app-calculate-badminton`. ADR-0006 đã chừa đường; Ducker ID nay có
`/oauth/authorize`, `/oauth/token`, `/oauth/userinfo`. Phạm vi chỉ định danh. Spec chung:
`web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`.

## 2. Quyết định

OIDC Authorization Code + PKCE (S256), public client, không secret, không backend. Mã nằm
ở `src/lib/ducker/` (config → pkce → auth → requests → session); UI là `AccountButton`
giữa chip mức khó và nút âm thanh trong `Header`. Cấu hình chỉ qua env, không giá trị mặc
định: tính năng bật khi cờ đúng chuỗi `true` và đủ bốn giá trị. `basePath` đổi từ
`GITHUB_PAGES` sang `NEXT_PUBLIC_BASE_PATH` vì cùng giá trị là gốc của `redirect_uri`.
`deploy.yml` không truyền cờ hay `DUCKER_*` (shipped dark). Hồ sơ chỉ ở bộ nhớ trang;
tải lại là chưa đăng nhập. `OWNER_LOCAL` của ADR-0006 giữ nguyên (ngoài phạm vi).

**Ngoại lệ NFR-SEC-07 (có giới hạn):** sessionStorage khoá `ducker.pkce` và nó bị xoá khi
quay về; mạng chỉ tới issuer đã cấu hình, và tới URL ảnh đại diện mà issuer trả về (có thể là host khác; không giới hạn ảnh), chỉ sau khi đăng nhập; cờ tắt
thì không có gì. E2E `review-and-network.spec.ts` và `ducker-id-flag-off.spec.ts` giữ ngưỡng
gốc trên bản cờ tắt.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giá trị mặc định trong code cho issuer/client | Đã bị cấm rõ: thiếu biến là tắt, không đoán |
| Lưu token/hồ sơ vào storage | Mở rộng bề mặt NFR-DATA-01 mà không có nhu cầu; tải lại chỉ cần bấm lại |
| Đồng bộ ván lên Ducker ID | Ngoài phạm vi (chỉ định danh); cần backend |
| Bật cờ ở deploy ngay | Chưa đăng ký client ở Ducker ID production |

## 4. Hệ quả

**Được:** game vẫn byte-for-byte như cũ khi cờ tắt; có sẵn luồng để bật sau.

**Mất / phải chấp nhận:** thêm một ngoại lệ cho NFR-SEC-07; `GITHUB_PAGES` biến mất khỏi
workflow. Không thêm dependency nào. **Nợ release:** mọi commit mang `[skip release]`;
`release.yml` quét cả đoạn từ tag gần nhất nên các push sau cũng bị bỏ qua tới khi có tag
mới. Lần release thật kế tiếp phải cắt tay một lần: `pnpm release:next` →
`git tag vX.Y.Z && git push origin vX.Y.Z` → `gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`.
Để bật thật: đăng ký client trong admin Ducker ID (redirect URI
`https://levananhduc.github.io/web-game-duck-caro/`), thêm bốn biến + cờ vào repo variables
và truyền trong `deploy.yml`.
