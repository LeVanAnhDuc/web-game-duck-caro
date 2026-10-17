import { expect, test } from "@/fixtures";
import type { Page } from "@playwright/test";
import { copy } from "@/data/copy";

test(
  "dòng thông báo là vùng live đọc mỗi nước và kết quả ván",
  { tag: ["@TC-ACCESSIBILITY-010"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat" });
    await expect(gamePage.notice()).toHaveAttribute("aria-live", "polite");

    await gamePage.playAt(0, 0);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.one, 0, 0));
    await gamePage.playAt(1, 1);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.two, 1, 1));
    await gamePage.resign();
    await expect(gamePage.notice()).toHaveText(copy.result.resigned(copy.seat.one));
  },
);

/** Every visible <button> narrower or shorter than 44px, as "name WxH". */
async function smallButtons(page: Page): Promise<string[]> {
  return page.locator("button:visible").evaluateAll((buttons) =>
    buttons
      .map((b) => {
        const r = b.getBoundingClientRect();
        const name = b.getAttribute("aria-label") ?? b.textContent?.trim() ?? "?";
        return { name, w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter((b) => b.w < 44 || b.h < 44)
      .map((b) => `${b.name} ${b.w}x${b.h}`),
  );
}

test(
  "mọi nút ở màn bắt đầu, trong ván và khi xem lại rộng và cao ít nhất 44px",
  { tag: ["@TC-ACCESSIBILITY-011"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    expect(await smallButtons(page)).toEqual([]);

    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAll([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    expect(await smallButtons(page)).toEqual([]);

    const settings = await gamePage.openSettings();
    expect(await smallButtons(page)).toEqual([]);
    await settings.close();

    await gamePage.resign();
    await gamePage.enterReview();
    await expect(gamePage.reviewRows()).toHaveCount(3);
    expect(await smallButtons(page)).toEqual([]);
  },
);
