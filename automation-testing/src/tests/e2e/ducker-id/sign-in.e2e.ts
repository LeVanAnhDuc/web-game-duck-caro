import { expect, test } from "@/fixtures";
import { DUCKER } from "@/data/test-data";

// FR-21 · US-07 · ADR-0029. Runs on the "app-auth" project: the flag-on export built by client's build:e2e
// against the fake issuer http://ducker.test, served on :3301.

const search = (page: import("@playwright/test").Page) => page.evaluate(() => window.location.search);

test.beforeEach(async ({ fakeIssuer }) => {
  await fakeIssuer();
});

test(
  "đăng nhập: quay về đúng màn, URL sạch, nút tài khoản hiện chữ cái đầu",
  { tag: ["@TC-DUCKERID-002", "@smoke"] },
  async ({ gamePage, page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await gamePage.goto();
    await gamePage.account.signInButton().click();

    await expect(gamePage.account.trigger()).toBeVisible();
    await expect(gamePage.account.trigger()).toHaveText(DUCKER.user.name[0]!);
    // Next writes its hydration URL back after the capture; the clean URL has to win and stay.
    await expect.poll(() => search(page)).not.toMatch(/code=|state=/);
    await expect(gamePage.startButton()).toBeVisible();
    expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
  },
);

test(
  "menu tài khoản hiện tên, email, hồ sơ và Esc đóng menu trả focus",
  { tag: ["@TC-DUCKERID-003"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.account.signInButton().click();
    await gamePage.account.trigger().click();

    await expect(gamePage.account.menu()).toContainText(DUCKER.user.name);
    await expect(gamePage.account.menu()).toContainText(DUCKER.user.email);
    await expect(gamePage.account.profileLink()).toHaveAttribute("href", `${DUCKER.issuer}${DUCKER.profilePath}`);

    await page.keyboard.press("Escape");
    await expect(gamePage.account.menu()).toHaveCount(0);
    await expect(gamePage.account.trigger()).toBeFocused();
  },
);

test("bấm ra ngoài hoặc Tab đóng menu tài khoản", { tag: ["@TC-DUCKERID-004"] }, async ({ gamePage, page }) => {
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();

  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  await gamePage.wordmark().click();
  await expect(gamePage.account.menu()).toHaveCount(0);

  await gamePage.account.trigger().click();
  await expect(gamePage.account.menu()).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(gamePage.account.menu()).toHaveCount(0);
});

test(
  "đăng xuất trả nút Đăng nhập và đặt focus vào nó",
  { tag: ["@TC-DUCKERID-005"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.account.signInButton().click();
    await gamePage.account.trigger().click();
    await gamePage.account.signOutItem().click();

    await expect(gamePage.account.signInButton()).toBeVisible();
    await expect(gamePage.account.signInButton()).toBeFocused();
    await expect(gamePage.account.trigger()).toHaveCount(0);
  },
);

test("đã đăng nhập vẫn đánh với máy như thường", { tag: ["@TC-DUCKERID-006"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.account.signInButton().click();
  await expect(gamePage.account.trigger()).toBeVisible();

  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  await expect(gamePage.account.trigger()).toBeVisible();
});

test(
  "hồ sơ chỉ nằm trong bộ nhớ, tải lại là chưa đăng nhập",
  { tag: ["@TC-DUCKERID-007", "@smoke"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.account.signInButton().click();
    await expect(gamePage.account.trigger()).toBeVisible();

    const stored = await page.evaluate(
      () => JSON.stringify({ ...window.localStorage }) + JSON.stringify({ ...window.sessionStorage }),
    );
    expect(stored).not.toContain(DUCKER.user.email);
    expect(stored).not.toContain(DUCKER.user.name);
    expect(await page.evaluate((key) => window.sessionStorage.getItem(key), DUCKER.pkceKey)).toBeNull();

    await page.reload();
    await expect(gamePage.account.signInButton()).toBeVisible();
  },
);
