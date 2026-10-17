import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAll([
    [0, 0],
    [-1, 0],
    [1, 1],
    [-2, -3],
  ]);
  await expect(gamePage.moveRows()).toHaveCount(4);
  await gamePage.resign();
  await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.one));
});

test(
  "Xem lại từ màn kết ván mở ở nước cuối",
  { tag: ["@TC-HISTORYREVIEW-004", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    await expect(gamePage.panel().getByText(copy.review.reviewing, { exact: true })).toBeVisible();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(4, 4));
    await expect(gamePage.reviewRows()).toHaveCount(4);
  },
);

test(
  "bốn nút điều hướng đi đúng một nước và tắt ở hai biên",
  { tag: ["@TC-HISTORYREVIEW-005", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    await expect(gamePage.reviewNav("next")).toBeDisabled();
    await expect(gamePage.reviewNav("last")).toBeDisabled();

    await gamePage.reviewNav("prev").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(3, 4));

    await gamePage.reviewNav("first").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(0, 4));
    await expect(gamePage.reviewNav("prev")).toBeDisabled();
    await expect(gamePage.reviewNav("first")).toBeDisabled();

    await gamePage.reviewNav("next").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(1, 4));

    await gamePage.reviewNav("last").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(4, 4));
  },
);

test(
  "bấm một hàng nhảy thẳng tới nước đó và chỉ một hàng được đánh dấu",
  { tag: ["@TC-HISTORYREVIEW-006"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    await expect(gamePage.panel().locator("[aria-current=true]")).toHaveCount(1);

    await gamePage.reviewRows().nth(1).click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(2, 4));
    await expect(gamePage.panel().locator("[aria-current=true]")).toHaveCount(1);
    await expect(gamePage.reviewRows().nth(1)).toHaveAttribute("aria-current", "true");
  },
);

test(
  "trong xem lại bấm lên bàn không tạo nước",
  { tag: ["@TC-HISTORYREVIEW-007"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    await gamePage.reviewRows().nth(1).click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(2, 4));

    for (const [x, y] of [
      [3, 3],
      [-4, 2],
    ] as const) {
      await gamePage.playAt(x, y);
    }
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(2, 4));
    await gamePage.panelButton(copy.review.exit).click();
    await expect(gamePage.moveRows()).toHaveCount(4);
  },
);

test(
  "thoát xem lại về thế cuối và kết quả ván còn nguyên",
  { tag: ["@TC-HISTORYREVIEW-008"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    await gamePage.reviewNav("first").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(0, 4));

    await gamePage.panelButton(copy.review.exit).click();
    await expect(gamePage.panel().getByText(copy.review.reviewing, { exact: true })).toHaveCount(0);
    await expect(gamePage.moveRows()).toHaveCount(4);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.one));
  },
);

test("chế độ xem lại có nút Giữa", { tag: ["@TC-HISTORYREVIEW-009"] }, async ({ gamePage }) => {
  // Review hides the play controls; without its own Giữa a resized window could leave an empty board and no way back.
  await gamePage.enterReview();
  await expect(gamePage.panelButton(copy.controls.recenter)).toBeVisible();
});

test(
  "bàn vẽ đúng thế trận tại nước đang xem",
  { tag: ["@TC-HISTORYREVIEW-010"] },
  async ({ gamePage }) => {
    await gamePage.enterReview();
    const atEnd = await gamePage.canvasHash();

    await gamePage.reviewNav("prev").click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(3, 4));
    await expect.poll(() => gamePage.canvasHash()).not.toBe(atEnd);
    const atThreeByButton = await gamePage.canvasHash();

    await gamePage.reviewNav("last").click();
    await expect.poll(() => gamePage.canvasHash()).toBe(atEnd);
    await gamePage.reviewRows().nth(2).click();
    await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(3, 4));
    await expect.poll(() => gamePage.canvasHash()).toBe(atThreeByButton);
  },
);
