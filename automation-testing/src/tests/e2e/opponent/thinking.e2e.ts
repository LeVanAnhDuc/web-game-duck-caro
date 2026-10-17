import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test(
  "trong lúc máy nghĩ, bấm thêm không đặt quân và Gợi ý tắt",
  { tag: ["@TC-OPPONENT-005"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ level: "hard" });
    await gamePage.playAt(0, 0);
    // Hard thinks for about a second: the click below lands while it is still the machine's turn.
    await gamePage.playAt(2, 0);
    await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);
    await expect(gamePage.panelButton(copy.controls.hint)).toBeDisabled();

    await expect(gamePage.notice()).toHaveText(/^Máy đánh ở /, { timeout: 15_000 });
    await expect(gamePage.moveRows()).toHaveCount(2);
    expect(await gamePage.moves()).not.toContainEqual([2, 0]);
  },
);

test.describe("máy không trả lời", () => {
  test.beforeEach(async ({ gamePage, page }) => {
    await page.clock.install();
    await gamePage.killEngine();
    await gamePage.goto();
    await gamePage.startGame();
    // The fake clock ticks on its own after install(); stop it so the 5s engine timeout only moves when told to.
    await page.clock.pauseAt(Date.now() + 1_000);
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);
  });

  test(
    "máy không trả lời thì sau 5 giây hết \"đang nghĩ\" và có thông báo",
    { tag: ["@TC-OPPONENT-008"] },
    async ({ gamePage, page }) => {
      await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);
      await page.clock.runFor(4_900);
      await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);

      await page.clock.runFor(200);
      await expect(gamePage.seat("two")).not.toHaveText(copy.notice.aiThinking);
      await expect(gamePage.notice()).toHaveText(copy.notice.aiGaveUp);
    },
  );

  // BUG: defects/opponent.md#bug-opponent-01
  test.fail(
    "sau khi máy không trả lời kịp, người chơi vẫn đánh tiếp được",
    { tag: ["@TC-OPPONENT-009"] },
    async ({ gamePage, page }) => {
      await page.clock.runFor(5_100);
      await expect(gamePage.notice()).toHaveText(copy.notice.aiGaveUp);

      await gamePage.playAt(2, 0);
      await expect(gamePage.moveRows()).not.toHaveCount(1, { timeout: 2_000 });
    },
  );
});
