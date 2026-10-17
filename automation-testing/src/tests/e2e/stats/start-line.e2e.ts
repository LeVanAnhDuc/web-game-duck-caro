import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { statsBlob, storageKey } from "@/data/test-data";

test(
  "màn bắt đầu hiện dòng thành tích của mức đang chọn",
  { tag: ["@TC-STATS-006"] },
  async ({ gamePage }) => {
    await gamePage.plant({ [storageKey.stats]: statsBlob({ easy: { wins: 2, losses: 1 } }) });
    await gamePage.goto();

    await gamePage.levelOption("easy").click();
    await expect(gamePage.startStatsLine()).toHaveText(copy.stats.line(2, 1, 0));

    await gamePage.levelOption("hard").click();
    await expect(gamePage.startStatsLine()).toHaveCount(0);
  },
);

test("thành tích sống qua tải lại trang", { tag: ["@TC-STATS-007"] }, async ({ gamePage, page }) => {
  await gamePage.goto();
  await gamePage.startGame({ level: "hard" });
  await gamePage.playAt(0, 0);
  await gamePage.resign();
  await expect(gamePage.resultTitle()).toBeVisible();
  await gamePage.panelButton(copy.result.playAgain).click();

  await page.reload();
  await gamePage.levelOption("hard").click();
  await expect(gamePage.startStatsLine()).toHaveText(copy.stats.line(0, 0, 1));
});
