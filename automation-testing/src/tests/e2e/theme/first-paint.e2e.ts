import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { paper } from "@/data/test-data";

test(
  "trang tải lại đã ở giao diện tối ngay từ khung hình đầu",
  { tag: ["@TC-THEME-004", "@smoke"] },
  async ({ gamePage, page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await gamePage.recordFirstFrame();
    await gamePage.goto();
    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.theme, copy.settings.dark).click();
    await settings.close();

    // A static export has no server to ask: the inline <head> script must set the theme before the first paint
    // (NFR-PERF-10). Reading it after load would let a one-frame white flash through.
    await page.reload();
    await expect.poll(() => gamePage.firstFrame()).toEqual({ attr: "dark", paper: paper.dark });
  },
);
