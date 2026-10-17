import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test(
  "mất mạng sau khi tải xong vẫn chơi tiếp, máy và gợi ý vẫn chạy",
  { tag: ["@TC-PRIVACY-004"] },
  async ({ gamePage, page, context }) => {
    await gamePage.goto();
    await page.waitForLoadState("networkidle");
    await context.setOffline(true);

    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.playAt(2, 2);
    await expect(gamePage.moveRows()).toHaveCount(4);
    await gamePage.hint();
    await expect(gamePage.notice()).toHaveText(copy.notice.hintAt, { timeout: 15_000 });
  },
);
