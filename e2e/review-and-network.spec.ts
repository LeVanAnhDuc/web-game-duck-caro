import { expect, test } from '@playwright/test';
import { expectMoves, panelButton, playAt, startGame } from './helpers';

test('xem lại ván: bàn lùi theo nước, danh sách bấm được (US-03 · FR-08 · FR-09)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await playAt(page, 1, 0);
  await expectMoves(page, 4);
  await panelButton(page, 'Bỏ ván').click();

  // Trước khi vào xem lại, danh sách KHÔNG bấm được.
  await expect(page.locator('aside ol button')).toHaveCount(0);

  await page.locator('aside').getByRole('button', { name: 'Xem lại' }).click();
  await expect(page.locator('aside').getByText('Đang xem lại')).toBeVisible();
  await expect(page.locator('aside').getByText('4 / 4')).toBeVisible();

  // Giờ mới bấm được, và đúng một hàng mang aria-current.
  await expect(page.locator('aside ol button')).toHaveCount(4);
  await expect(page.locator('aside [aria-current="true"]')).toHaveCount(1);

  await page.locator('aside').getByRole('button', { name: 'Nước trước' }).click();
  await expect(page.locator('aside').getByText('3 / 4')).toBeVisible();

  await page.locator('aside').getByRole('button', { name: 'Về nước đầu' }).click();
  await expect(page.locator('aside').getByText('0 / 4')).toBeVisible();
  // Ở nước 0 thì hai nút lùi phải tắt.
  await expect(
    page.locator('aside').getByRole('button', { name: 'Nước trước' }),
  ).toBeDisabled();

  // Nhảy thẳng tới một nước trong danh sách.
  await page.locator('aside ol button').nth(1).click();
  await expect(page.locator('aside').getByText('2 / 4')).toBeVisible();

  await page.locator('aside').getByRole('button', { name: 'Thoát xem lại' }).click();
  await expect(page.locator('aside').getByText('Đang xem lại')).toBeHidden();
  await expectMoves(page, 4);
});

test('chế độ xem lại có nút Giữa, nên người chơi không mắc kẹt với bàn trống', async ({
  page,
}) => {
  // Nợ đã ghi trong backlog: resize có thể đẩy thế trận ra ngoài khung nhìn, và cách
  // thoát là bấm "Giữa". Chế độ xem lại ẩn `Controls`, nên nếu thanh tua không có nút
  // đó thì món nợ kia mất van an toàn. Tìm ra bằng cách bấm thật ở mốc 5.
  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await panelButton(page, 'Bỏ ván').click();
  await page.locator('aside').getByRole('button', { name: 'Xem lại' }).click();

  await expect(page.locator('aside').getByRole('button', { name: 'Giữa' })).toBeVisible();
});

test('sau khi tải xong, không request nào RA NGOÀI origin (NFR-SEC-07)', async ({
  page,
}) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
      outside.push(request.url());
    }
  });

  await page.goto('/');
  await startGame(page);
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await panelButton(page, 'Gợi ý').click();
  await expect(page.locator('aside').getByText(/^Gợi ý: đánh ở /)).toBeVisible({
    timeout: 15_000,
  });

  // Không analytics, không telemetry, không font ngoài. Đo bằng máy, không bằng mắt.
  expect(outside).toEqual([]);
});

test('thống kê cộng vào ĐÚNG mức vừa chơi, và chỉ cộng MỘT lần (FR-12 · US-04)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page, { level: 'Dễ' });
  await playAt(page, 0, 0);
  await expectMoves(page, 2);
  await panelButton(page, 'Bỏ ván').click();

  // Đổi kích thước sau khi kết ván: mỗi lần resize là một render mới với `status` mới,
  // và không có khoá chống đếm trùng thì một ván bỏ đếm thành nhiều.
  for (const width of [1100, 1280, 1180]) {
    await page.setViewportSize({ width, height: 900 });
  }

  const row = page.locator('aside').getByText(/^Dễ$/).locator('..');
  await expect(row).toContainText('1 bỏ');
  await expect(row).not.toContainText('2 bỏ');
  // Mức khác vẫn trắng — thống kê tách theo mức.
  await expect(page.locator('aside').getByText(/^Khó$/).locator('..')).toContainText(
    'chưa chơi',
  );
});
