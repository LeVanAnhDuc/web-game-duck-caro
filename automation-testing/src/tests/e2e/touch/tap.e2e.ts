import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
});

test(
  "chạm một ô chỉ hiện quân xem trước và nút Đánh",
  { tag: ["@TC-TOUCH-001", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.tapAt(1, 0);
    await expect(gamePage.placeButton()).toBeVisible();
    expect(await gamePage.moveCount()).toBe(0);
  },
);

test(
  "chạm lại đúng ô đang xem trước thì thành nước thật",
  { tag: ["@TC-TOUCH-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.tapAt(1, 0);
    await expect(gamePage.placeButton()).toBeVisible();
    await gamePage.tapAt(1, 0);

    await expect(gamePage.noticeBar()).toHaveText(copy.notice.movedAt(copy.seat.one, 1, 0));
    expect(await gamePage.moveCount()).toBe(1);
    await expect(gamePage.placeButton()).toHaveCount(0);
  },
);

test("bấm Đánh đặt quân ở ô đang xem trước", { tag: ["@TC-TOUCH-003"] }, async ({ gamePage }) => {
  await gamePage.tapAt(-2, 1);
  await gamePage.placeButton().tap();
  await expect(gamePage.noticeBar()).toHaveText(copy.notice.movedAt(copy.seat.one, -2, 1));
  expect(await gamePage.moveCount()).toBe(1);
});

test("chạm sang ô khác dời quân xem trước, không đánh", { tag: ["@TC-TOUCH-004"] }, async ({ gamePage }) => {
  await gamePage.tapAt(1, 0);
  await gamePage.tapAt(2, 2);
  await expect(gamePage.placeButton()).toBeVisible();
  expect(await gamePage.moveCount()).toBe(0);

  await gamePage.tapAt(2, 2);
  await expect(gamePage.noticeBar()).toHaveText(copy.notice.movedAt(copy.seat.one, 2, 2));
  expect(await gamePage.moveCount()).toBe(1);
});
