import { expect, test } from "@/fixtures";
import { DUCKER } from "@/data/test-data";

// The deployed build (flag off, ADR-0029): no button, no storage, nothing off the site, and a stray ?code is not
// read as a sign-in callback.
test(
  "cờ tắt: không nút, không sessionStorage, không request ra ngoài, URL có code bị bỏ mặc",
  { tag: ["@TC-DUCKERID-001", "@smoke"] },
  async ({ gamePage, page, urls }) => {
    const own = new URL(urls.webUrl).origin;
    const outside: string[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).origin !== own) outside.push(r.url());
    });
    await page.goto("./?code=x&state=y");
    await expect(gamePage.settingsButton()).toBeVisible();

    await expect(gamePage.account.anySignIn()).toHaveCount(0);
    await expect(gamePage.account.trigger()).toHaveCount(0);
    expect(await page.evaluate((key) => window.sessionStorage.getItem(key), DUCKER.pkceKey)).toBeNull();
    expect(outside).toEqual([]);
    expect(new URL(page.url()).searchParams.get("code")).toBe("x");
  },
);
