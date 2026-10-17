import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test("nút Cài đặt mở hộp thoại và Đóng đóng nó", { tag: ["@TC-SETTINGS-001"] }, async ({ gamePage }) => {
  const settings = await gamePage.openSettings();
  await expect(settings.root()).toBeVisible();
  await settings.closeButton().click();
  await expect(settings.root()).toHaveCount(0);
});

test("Cài đặt có mục Bàn phím dạy các phím của bàn", { tag: ["@TC-SETTINGS-011"] }, async ({ gamePage }) => {
  const settings = await gamePage.openSettings();
  await expect(settings.root().getByText(copy.settings.keyboardHelp, { exact: true })).toBeVisible();
});

test("mọi điều khiển trong Cài đặt có nhãn đọc được", { tag: ["@TC-SETTINGS-012"] }, async ({ gamePage }) => {
  const settings = await gamePage.openSettings();
  await expect(settings.root().getByLabel(copy.settings.sound)).toBeVisible();
  for (const group of [copy.settings.theme, copy.settings.pieces, copy.settings.defaultLevel, copy.settings.defaultRule]) {
    await expect(settings.root().getByRole("group", { name: group, exact: true })).toBeVisible();
  }
});
