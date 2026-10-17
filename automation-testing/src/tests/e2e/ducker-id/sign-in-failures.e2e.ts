import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { DUCKER } from "@/data/test-data";

const search = (page: import("@playwright/test").Page) => page.evaluate(() => window.location.search);

test(
  "từ chối ở Ducker ID thì về chưa đăng nhập, URL sạch",
  { tag: ["@TC-DUCKERID-008"] },
  async ({ gamePage, page, fakeIssuer }) => {
    await fakeIssuer("deny");
    await gamePage.goto();
    await gamePage.account.signInRoundTrip(DUCKER.issuer);
    await expect(gamePage.account.signInButton()).toBeVisible();
    await expect.poll(() => search(page)).not.toMatch(/error|state=/);
    await expect(gamePage.account.trigger()).toHaveCount(0);
  },
);

test(
  "state bị sửa thì về chưa đăng nhập và không bao giờ gọi token",
  { tag: ["@TC-DUCKERID-009", "@smoke"] },
  async ({ gamePage, page, fakeIssuer }) => {
    const issuer = await fakeIssuer("tamper");
    await gamePage.goto();
    await gamePage.account.signInRoundTrip(DUCKER.issuer);
    await expect(gamePage.account.signInButton()).toBeVisible();
    await expect.poll(() => search(page)).not.toMatch(/code=|state=/);
    expect(issuer.tokenCalls()).toBe(0);
  },
);

test(
  "Ducker ID treo thì sau tối đa 15 giây về chưa đăng nhập",
  { tag: ["@TC-DUCKERID-010"] },
  async ({ gamePage, page, fakeIssuer }) => {
    // AbortSignal.timeout(15s) is a native timer that page.clock cannot fast-forward: this one waits for real.
    test.setTimeout(45_000);
    const issuer = await fakeIssuer("hang");
    await gamePage.goto();
    await gamePage.account.signInRoundTrip(DUCKER.issuer);
    await expect.poll(() => issuer.tokenCalls()).toBe(1);
    // Exact name: the in-flight "Đang đăng nhập…" also contains the words and would pass for the wrong reason.
    await expect(gamePage.account.signInButton()).toBeVisible({ timeout: 20_000 });
    await expect.poll(() => search(page)).not.toMatch(/code=|state=/);
  },
);

test(
  "sessionStorage bị chặn thì bấm Đăng nhập không đưa đi đâu",
  { tag: ["@TC-DUCKERID-011"] },
  async ({ gamePage, page, fakeIssuer }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "sessionStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
    await fakeIssuer();
    const toIssuer: string[] = [];
    page.on("request", (r) => {
      if (r.url().startsWith(DUCKER.issuer)) toIssuer.push(r.url());
    });
    await gamePage.goto();
    await gamePage.account.signInButton().click();
    await expect(gamePage.account.signInButton()).toBeEnabled();
    await expect(gamePage.account.signInButton()).toHaveAccessibleName(copy.account.signIn);
    expect(toIssuer).toEqual([]);
  },
);
