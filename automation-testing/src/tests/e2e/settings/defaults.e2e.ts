import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { settingsBlob, storageKey } from "@/data/test-data";

test(
  "mức khó mặc định điền sẵn màn bắt đầu, kể cả ván đầu sau khi tải trang",
  { tag: ["@TC-SETTINGS-006", "@smoke"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.defaultLevel, copy.level.hard).click();
    await settings.close();

    await page.reload();
    await expect(gamePage.levelOption("hard")).toHaveAttribute("aria-pressed", "true");
    await gamePage.startButton().click();
    await expect(gamePage.badge()).toHaveText(copy.level.hard);
  },
);

test("luật mặc định điền sẵn màn bắt đầu", { tag: ["@TC-SETTINGS-007"] }, async ({ gamePage, page }) => {
  await gamePage.goto();
  const settings = await gamePage.openSettings();
  await settings.option(copy.settings.defaultRule, copy.rule.free).click();
  await settings.close();

  await page.reload();
  await expect(gamePage.ruleOption("free")).toHaveAttribute("aria-pressed", "true");
  await expect(gamePage.ruleHint()).toHaveText(copy.rule.freeHint);
});

test(
  "cài đặt sống qua tải lại và nằm ở khoá riêng của máy",
  { tag: ["@TC-SETTINGS-008"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    let settings = await gamePage.openSettings();
    await settings.option(copy.settings.defaultLevel, copy.level.hard).click();
    await settings.soundCheckbox().uncheck();
    await settings.close();
    // The settings key deliberately carries no owner: it belongs to the machine, not to a player (ADR-0019).
    expect(Object.keys(await gamePage.storage())).toContain(storageKey.settings);

    await page.reload();
    settings = await gamePage.openSettings();
    await expect(settings.option(copy.settings.defaultLevel, copy.level.hard)).toHaveAttribute("aria-pressed", "true");
    await expect(settings.soundCheckbox()).not.toBeChecked();
  },
);

test("cài đặt lưu bị hỏng thì về mặc định", { tag: ["@TC-SETTINGS-013"] }, async ({ gamePage }) => {
  // One invalid field sends the whole blob back to the defaults, so "hard" must not survive either.
  await gamePage.plant({ [storageKey.settings]: settingsBlob({ defaultLevel: "hard", pieceSet: "rainbow" }) });
  await gamePage.goto();
  await expect(gamePage.levelOption("normal")).toHaveAttribute("aria-pressed", "true");

  const settings = await gamePage.openSettings();
  await expect(settings.option(copy.settings.pieces, new RegExp(copy.settings.pieceSet.pencil))).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  for (const group of [copy.settings.theme, copy.settings.pieces, copy.settings.defaultLevel, copy.settings.defaultRule]) {
    await expect(
      settings.root().getByRole("group", { name: group, exact: true }).locator("button[aria-pressed=true]"),
    ).toHaveCount(1);
  }
});
