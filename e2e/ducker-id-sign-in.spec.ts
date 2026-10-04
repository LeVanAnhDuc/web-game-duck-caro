import { expect, test } from '@playwright/test';

/**
 * Vòng đăng nhập Ducker ID (ADR-0029) trên bản build cờ BẬT (`out-auth/`, cổng 3301),
 * issuer giả `http://ducker.test`. Bản cờ tắt chạy ở project `chromium` và không được có
 * nút nào.
 */
const ISSUER = 'http://ducker.test';
const CORS = { 'access-control-allow-origin': '*' };

test.describe('cờ bật', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${ISSUER}/oauth/authorize**`, async (route) => {
      const url = new URL(route.request().url());
      const back = new URL(url.searchParams.get('redirect_uri')!);
      back.searchParams.set('code', 'code-1');
      back.searchParams.set('state', url.searchParams.get('state')!);
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
    });
    await page.route(`${ISSUER}/oauth/token`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: CORS,
        body: JSON.stringify({ access_token: 'at-1', token_type: 'Bearer', expires_in: 900 }),
      }),
    );
    await page.route(`${ISSUER}/oauth/userinfo`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: CORS,
        body: JSON.stringify({ sub: 'u1', name: 'Lê Văn Anh Đức', email: 'duc@ducker.id' }),
      }),
    );
  });

  test('đăng nhập, hiện tên, URL sạch, đăng xuất; reload thì đăng xuất', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    const account = page.getByRole('button', { name: 'Tài khoản Ducker ID' });
    await expect(account).toBeVisible();
    // Sau hydrate Next có thể ghi lại ?code&state — chờ ổn định rồi mới kiểm.
    await expect
      .poll(() => new URL(page.url()).search, { timeout: 3000 })
      .not.toMatch(/code=|state=/);
    await account.click();
    await expect(page.getByText('Lê Văn Anh Đức')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Mở hồ sơ Ducker ID' })).toHaveAttribute(
      'href',
      `${ISSUER}/profile`,
    );
    await page.getByRole('menuitem', { name: 'Đăng xuất' }).click();
    const signIn = page.getByRole('button', { name: 'Đăng nhập' });
    await expect(signIn).toBeVisible();
    await expect(signIn).toBeFocused();

    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await expect(account).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
  });

  test('IdP từ chối: về lại đăng xuất, URL sạch', async ({ page }) => {
    await page.route(`${ISSUER}/oauth/authorize**`, async (route) => {
      const url = new URL(route.request().url());
      const back = new URL(url.searchParams.get('redirect_uri')!);
      back.searchParams.set('error', 'access_denied');
      back.searchParams.set('state', url.searchParams.get('state')!);
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    // Nút vẫn hiện ngay trước khi trang đi — chờ tới khi trang quay về và dọn xong phiên chờ.
    await page.waitForFunction(() => sessionStorage.getItem('ducker.pkce') === null);
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    expect(new URL(page.url()).search).toBe('');
    await expect(page.getByRole('button', { name: 'Tài khoản Ducker ID' })).toHaveCount(0);
  });

  test('state bị sửa: không đăng nhập', async ({ page }) => {
    await page.route(`${ISSUER}/oauth/authorize**`, async (route) => {
      const url = new URL(route.request().url());
      const back = new URL(url.searchParams.get('redirect_uri')!);
      back.searchParams.set('code', 'code-1');
      back.searchParams.set('state', 'tampered');
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    // Nút vẫn hiện ngay trước khi trang đi — chờ tới khi trang quay về và dọn xong phiên chờ.
    await page.waitForFunction(() => sessionStorage.getItem('ducker.pkce') === null);
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    expect(new URL(page.url()).search).toBe('');
  });

  for (const width of [375, 360, 320]) {
    test(`${width}px: mọi nút trong header >= 44x44, không đè nhau, tên hiển thị không vỡ`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
      const buttons = page.locator('header button');
      const count = await buttons.count();
      const boxes: { label: string; x: number; y: number; width: number; height: number }[] =
        [];
      for (let i = 0; i < count; i += 1) {
        const el = buttons.nth(i);
        const box = (await el.boundingBox())!;
        const label = (await el.getAttribute('aria-label')) ?? (await el.textContent()) ?? '';
        expect(box.width, `${label} rộng ${box.width}`).toBeGreaterThanOrEqual(44);
        expect(box.height, `${label} cao ${box.height}`).toBeGreaterThanOrEqual(44);
        boxes.push({ label, ...box });
      }
      console.log(width, JSON.stringify(boxes.map((b) => [b.label, Math.round(b.width)])));
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const p = boxes[i]!;
          const q = boxes[j]!;
          const overlap =
            p.x < q.x + q.width &&
            q.x < p.x + p.width &&
            p.y < q.y + q.height &&
            q.y < p.y + p.height;
          expect(overlap, `${p.label} đè ${q.label}`).toBe(false);
        }
      }
      const word = (await page.locator('header span.font-semibold').boundingBox())!;
      expect(word.height, 'wordmark không xuống dòng').toBeLessThan(28);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);
    });
  }
});
