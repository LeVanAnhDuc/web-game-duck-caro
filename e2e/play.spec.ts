import { expect, test } from '@playwright/test';
import { expectMoves, moveCount, panelButton, playAt, startGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('máy đáp lại nước của người chơi — Worker chạy thật (US-01 · FR-04)', async ({
  page,
}) => {
  // Đây là bài test mà 253 unit test không thay được: mọi test AI đều tiêm Engine giả,
  // nên chưa cái nào chứng minh `engine.worker.ts` khởi động và trả nước trong một
  // trình duyệt thật. Gửi sai hình dạng thông điệp thì unit test vẫn xanh hết.
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);

  const rows = page.locator('aside ol li');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('0,   0');
});

test('đánh vào ô đã có quân thì bị từ chối và có thông báo', async ({ page }) => {
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await playAt(page, 0, 0);
  await expect(page.locator('aside').getByText('Ô đó đã có quân')).toBeVisible();
  expect(await moveCount(page)).toBe(2);
});

test('hoàn nước lấy lại CẢ nước của máy (FR-07)', async ({ page }) => {
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await panelButton(page, 'Hoàn').click();
  await expectMoves(page, 0);
});

test('gợi ý không thêm nước nào vào ván (FR-10 · ADR-0016)', async ({ page }) => {
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);

  await panelButton(page, 'Gợi ý').click();
  // Mức Khó tốn tới ~1.2s, nên chờ trên nội dung chứ không trên thời gian.
  await expect(page.locator('aside').getByText(/^Gợi ý: đánh ở /)).toBeVisible({
    timeout: 15_000,
  });
  expect(await moveCount(page)).toBe(2);
  // Gợi ý hiện ra dưới dạng quân xem trước, nên nút "Đánh" phải xuất hiện.
  await expect(page.getByRole('button', { name: 'Đánh', exact: true })).toBeVisible();
});

test('máy đi trước thì nó tự đánh nước đầu (FR-06)', async ({ page }) => {
  await startGame(page, { first: 'Máy' });
  await expectMoves(page, 1);
  await expect(page.locator('aside ol li').first()).toBeVisible();
});
