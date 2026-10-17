import { expect, test } from '@playwright/test';

/** Bản build deploy (cờ tắt): không nút, không storage, không request ra ngoài (ADR-0029). */
test('cờ tắt: không có nút đăng nhập, không đụng sessionStorage, không request ra ngoài', async ({
  page,
}) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    const { hostname } = new URL(request.url());
    if (hostname !== '127.0.0.1' && hostname !== 'localhost') outside.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Cài đặt' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Đăng nhập|Tài khoản Ducker ID/ })).toHaveCount(
    0,
  );
  expect(await page.evaluate(() => sessionStorage.getItem('ducker.pkce'))).toBeNull();
  expect(outside).toEqual([]);
});
