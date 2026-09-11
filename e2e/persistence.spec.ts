import { expect, test } from '@playwright/test';
import { expectMoves, moveCount, panelButton, playAt, startGame } from './helpers';

test('ván dở sống qua một lần TẢI LẠI TRANG thật (US-02 · FR-11)', async ({ page }) => {
  // `usePersistence` được unit test với storage giả. Bài này là chỗ duy nhất chứng minh
  // `localStorage` thật + `replay` dựng lại đúng ván sau một lần reload.
  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await playAt(page, 1, 0);
  await expectMoves(page, 4);

  const before = await page.locator('aside ol').textContent();

  await page.reload();
  await expect(page.getByRole('button', { name: 'Bắt đầu ván mới' })).toBeHidden();
  await expectMoves(page, 4);
  expect(await page.locator('aside ol').textContent()).toBe(before);
});

test('ván kết thúc thì không còn gì để tiếp tục sau reload', async ({ page }) => {
  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await panelButton(page, 'Bỏ ván').click();
  await expect(
    page.locator('aside').getByText('Bạn đã bỏ ván').first(),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: 'Bắt đầu ván mới' })).toBeVisible();
});

test('cài đặt sống qua reload, và nó là seam RIÊNG (US-04 · FR-16 · ADR-0019)', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  // Bó vào dialog: màn chọn mức phía sau cũng có một nút "Khó".
  const dialog = page.getByRole('dialog', { name: 'Cài đặt' });
  await dialog.getByRole('button', { name: 'Khó', exact: true }).click();
  await page.locator('#setting-sound').click();
  await page.getByRole('button', { name: 'Đóng' }).click();

  const key = await page.evaluate(() =>
    Object.keys(window.localStorage).filter((k) => k.startsWith('gomoku:')),
  );
  // Khoá cài đặt CỐ Ý không mang tiền tố chủ sở hữu — đó là điều làm nó thuộc về máy.
  expect(key).toContain('gomoku:v2:settings');

  await page.reload();
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  await expect(
    page
      .getByRole('dialog', { name: 'Cài đặt' })
      .getByRole('button', { name: 'Khó', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#setting-sound')).not.toBeChecked();
  // Và mức khó mặc định đã áp vào màn chọn mức.
  await page.getByRole('button', { name: 'Đóng' }).click();
  await expect(page.locator('header').getByText('Khó')).toBeVisible();
});

test('xoá toàn bộ dữ liệu dọn CẢ hai seam (NFR-DATA-04)', async ({ page }) => {
  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);

  await page.getByRole('button', { name: 'Cài đặt' }).click();
  await page
    .getByRole('dialog', { name: 'Cài đặt' })
    .getByRole('button', { name: 'Xoá toàn bộ dữ liệu' })
    .click();
  await page.getByRole('button', { name: 'Xoá hẳn' }).click();

  const left = await page.evaluate(() =>
    Object.keys(window.localStorage).filter((k) => k.startsWith('gomoku:')),
  );
  expect(left).toEqual([]);
});

test('localStorage bị chặn thì app vẫn chơi được (NFR-REL-04)', async ({ browser }) => {
  const context = await browser.newContext();
  // Làm `localStorage` ném ở MỌI lối vào, kể cả lúc truy cập thuộc tính — đúng cách
  // cửa sổ ẩn danh và thiết lập chặn site data hành xử.
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('storage bi chan');
      },
    });
  });
  const page = await context.newPage();
  await page.goto('/');

  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  expect(await moveCount(page)).toBe(2);

  // Được phép QUÊN — reload về màn chọn mức — nhưng không được phép vỡ.
  await page.reload();
  await expect(page.getByRole('button', { name: 'Bắt đầu ván mới' })).toBeVisible();
  await context.close();
});
