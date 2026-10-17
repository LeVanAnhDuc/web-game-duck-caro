import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test(
  "màn bắt đầu chọn sẵn Caro Việt và câu giải thích đổi theo luật",
  { tag: ["@TC-WINRULE-009"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await expect(gamePage.ruleOption("blocked")).toHaveAttribute("aria-pressed", "true");
    await expect(gamePage.ruleOption("free")).toHaveAttribute("aria-pressed", "false");
    await expect(gamePage.ruleHint()).toHaveText(copy.rule.blockedHint);

    await gamePage.ruleOption("free").click();
    await expect(gamePage.ruleOption("free")).toHaveAttribute("aria-pressed", "true");
    await expect(gamePage.ruleHint()).toHaveText(copy.rule.freeHint);

    await gamePage.ruleOption("blocked").click();
    await expect(gamePage.ruleHint()).toHaveText(copy.rule.blockedHint);
  },
);

test(
  "luật của ván sống qua tải lại, không bị luật mặc định trong cài đặt đè",
  { tag: ["@TC-WINRULE-011"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", rule: "free" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);

    // The settings default only pre-fills the start screen; the running game keeps its own rule (invariant 14).
    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.defaultRule, copy.rule.blocked).click();
    await settings.close();

    await page.reload();
    await expect(gamePage.moveRows()).toHaveCount(1);
    // Under Caro Việt this five, closed at both ends, would not win.
    await gamePage.playAll([
      [-1, 0],
      [1, 0],
      [5, 0],
      [2, 0],
      [9, 9],
      [3, 0],
      [8, 8],
      [4, 0],
    ]);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
  },
);

test(
  "Chơi lại đưa về màn bắt đầu và ván mới bắt đầu từ bàn trống",
  { tag: ["@TC-WINRULE-012"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAll([
      [0, 0],
      [0, 5],
      [1, 0],
      [1, 5],
      [2, 0],
      [2, 5],
      [3, 0],
      [3, 5],
      [4, 0],
    ]);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));

    await gamePage.panelButton(copy.result.playAgain).click();
    await expect(gamePage.startButton()).toBeVisible();
    await gamePage.startGame({ mode: "hotseat" });
    await expect(gamePage.moveRows()).toHaveCount(0);
    await expect(gamePage.resultTitle()).toHaveCount(0);
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);
  },
);
