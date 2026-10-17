import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import type { GamePage } from "@/pages/game.page";

/** Load and play one move, so the Worker and its lazily loaded chunk are fetched too. */
async function loadAndPlay(gamePage: GamePage): Promise<void> {
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
}

test(
  "bản xuất tĩnh mở với tiêu đề, ngôn ngữ đúng và không tài nguyên nào lỗi",
  { tag: ["@TC-DEPLOY-001", "@smoke"] },
  async ({ gamePage, page }) => {
    const broken: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`);
    });
    page.on("requestfailed", (r) => broken.push(`failed ${r.url()} ${r.failure()?.errorText ?? ""}`));

    await loadAndPlay(gamePage);
    await expect(page).toHaveTitle(copy.appName);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    expect(broken).toEqual([]);
  },
);

test(
  "mọi request của trang nằm dưới base path của site",
  { tag: ["@TC-DEPLOY-002", "@smoke"] },
  async ({ gamePage, page, urls }) => {
    const base = `${urls.webUrl}/`;
    const outside: string[] = [];
    page.on("request", (r) => {
      if (!r.url().startsWith(base)) outside.push(r.url());
    });
    await loadAndPlay(gamePage);
    expect(outside).toEqual([]);
  },
);
