# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-21), `docs/01-product/journeys.md` (US-07 và "Điều gì có thể sai":
  từ chối, `state` sửa, treo 15 giây, màn 375px), `docs/decisions/0029-ducker-id-sign-in-behind-a-flag.md`,
  `docs/specs/ducker-id-sign-in/design.md`, `client/.env.example`, `README.md` §"Optional sign-in with Ducker ID".
- **Code:** `client/src/lib/ducker/` (`config.ts` `DUCKER_PKCE_KEY`, `auth.ts`, `requests.ts` `REQUEST_TIMEOUT_MS = 15_000`,
  `session.ts`, `initials.ts`), `client/src/hooks/useDuckerAuth.ts`, `client/src/hooks/useAccountMenu.ts` (Esc, Tab, bấm
  ra ngoài), `client/src/views/Home/mains/AccountButton`, `client/scripts/build-e2e.mjs` (bản cờ bật, issuer giả
  `http://ducker.test`, client `e2e-client`, hồ sơ `/profile`).
- **Test đã gom (gợi ý):** `client/e2e/ducker-id-flag-off.spec.ts` → TC-DUCKERID-001; `client/e2e/ducker-id-sign-in.spec.ts`
  → TC-DUCKERID-002/003/004/006 (vòng đăng nhập), -007 (từ chối, `state` sửa), -011 (header 375/360/320), -012 (menu
  320/375/768/1440).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Issuer giả là một fixture (`fakeIssuer`) với bốn chế độ ok / deny / tamper / hang thay cho ba khối `page.route`
  chép tay; nó đếm số lần gọi token để chứng minh `state` sai không bao giờ tới token.
- **Q2** Nút đăng nhập khớp theo **đúng** tên "Đăng nhập": nhãn lúc đang bay "Đang đăng nhập…" cũng chứa chữ đó, và khớp
  lỏng sẽ làm case treo xanh sai lý do.
- **Q3** Case treo đợi thật tới 15 giây: `AbortSignal.timeout` là đồng hồ native, `page.clock` không tua được.
- **Q4** Project `app-auth` chỉ có trên dev (bản cờ bật build tại chỗ). Trên prd chỉ chạy TC-DUCKERID-001 (cờ tắt).
- **Q5** Bỏ `console.log` kích thước nút và `waitForFunction` chép tay của bản cũ; vòng đi–về chờ bằng response 302 của
  `/oauth/authorize` rồi `load`.

## Tài khoản test

Không có tài khoản thật: issuer giả trả hồ sơ cố định `Lê Văn Anh Đức` / `duc@ducker.id`.

## Ngoài phạm vi

- Ảnh đại diện từ issuer (`picture`) và rơi về chữ cái khi ảnh lỗi: unit test `AccountButton/index.test.tsx`.
- Ducker ID thật: ngoài repo này.

## Tech debt liên quan

_(không có)_
