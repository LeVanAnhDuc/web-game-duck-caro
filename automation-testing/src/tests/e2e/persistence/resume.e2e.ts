import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { storageKey } from "@/data/test-data";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test(
  "ván dở sống qua một lần tải lại trang thật",
  { tag: ["@TC-PERSISTENCE-001", "@smoke"] },
  async ({ gamePage, page }) => {
    // usePersistence is unit-tested with fake storage; this is the one place real localStorage + replay is proven.
    await gamePage.startGame({ level: "easy" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.playAt(1, 0);
    await expect(gamePage.moveRows()).toHaveCount(4);
    const before = await gamePage.moves();

    await page.reload();
    await expect(gamePage.moveRows()).toHaveCount(4);
    await expect(gamePage.startButton()).toBeHidden();
    expect(await gamePage.moves()).toEqual(before);
    await expect(gamePage.badge()).toHaveText(copy.level.easy);

    await gamePage.playAt(-3, 3);
    await expect(gamePage.moveRows()).toHaveCount(6);
  },
);

test(
  "tải lại đúng lúc máy đang nghĩ thì máy đánh ngay khi mở lại",
  { tag: ["@TC-PERSISTENCE-002"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame({ level: "hard" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);

    await page.reload();
    await expect(gamePage.moveRows()).toHaveCount(2, { timeout: 15_000 });
    expect((await gamePage.moves())[0]).toEqual([0, 0]);
    await expect(gamePage.notice()).toHaveText(/^Máy đánh ở .*Lượt bạn\.$/);
  },
);

test(
  "ván đã kết thúc không còn gì để tiếp tục sau tải lại",
  { tag: ["@TC-PERSISTENCE-003"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.resign();
    await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.you));

    await page.reload();
    await expect(gamePage.startButton()).toBeVisible();
  },
);

test("Chơi lại xoá ván cũ khỏi bộ nhớ", { tag: ["@TC-PERSISTENCE-004"] }, async ({ gamePage, page }) => {
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  await gamePage.resign();
  await gamePage.panelButton(copy.result.playAgain).click();
  await expect(gamePage.startButton()).toBeVisible();

  await page.reload();
  await expect(gamePage.startButton()).toBeVisible();
  expect(Object.keys(await gamePage.storage())).not.toContain(storageKey.currentGame);
});
