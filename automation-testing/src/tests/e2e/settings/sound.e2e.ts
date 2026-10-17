import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test(
  "nút âm thanh ở header và ô trong Cài đặt luôn khớp nhau",
  { tag: ["@TC-SETTINGS-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    // The header button names the action a press does: while sound is on it offers to turn it off.
    await expect(gamePage.soundButton()).toHaveAccessibleName(copy.header.soundOff);
    await expect(gamePage.soundButton()).toHaveAttribute("aria-pressed", "true");

    await gamePage.soundButton().click();
    await expect(gamePage.soundButton()).toHaveAccessibleName(copy.header.soundOn);
    await expect(gamePage.soundButton()).toHaveAttribute("aria-pressed", "false");

    const settings = await gamePage.openSettings();
    await expect(settings.soundCheckbox()).not.toBeChecked();
    await settings.soundCheckbox().check();
    await expect(gamePage.soundButton()).toHaveAccessibleName(copy.header.soundOff);
    await expect(gamePage.soundButton()).toHaveAttribute("aria-pressed", "true");
  },
);

test(
  "âm thanh bật: mỗi nước phát tiếng tổng hợp, nước người và máy khác cao độ, không file nào",
  { tag: ["@TC-SETTINGS-003"] },
  async ({ gamePage, page }) => {
    const media: string[] = [];
    page.on("request", (r) => {
      if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i.test(r.url()) || r.resourceType() === "media") media.push(r.url());
    });
    await gamePage.spyAudio();
    await gamePage.goto();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);

    await expect.poll(async () => (await gamePage.audio()).started.length).toBeGreaterThanOrEqual(2);
    const log = await gamePage.audio();
    expect(log.contexts).toBe(1);
    expect(log.decoded).toBe(0);
    // One note for the player's move, one for the machine's reply: told apart by pitch.
    const [mine, reply] = log.started;
    expect(mine).not.toBe(reply);
    expect(media).toEqual([]);
  },
);

test("âm thanh tắt thì không phát gì", { tag: ["@TC-SETTINGS-004"] }, async ({ gamePage }) => {
  await gamePage.spyAudio();
  await gamePage.goto();
  await gamePage.soundButton().click();
  await expect(gamePage.soundButton()).toHaveAttribute("aria-pressed", "false");
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  await gamePage.playAt(2, 2);
  await expect(gamePage.moveRows()).toHaveCount(4);

  expect((await gamePage.audio()).oscillators).toBe(0);
});

test(
  "trình duyệt chặn âm thanh thì game im lặng và vẫn chơi được",
  { tag: ["@TC-SETTINGS-005"] },
  async ({ gamePage, page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await gamePage.blockAudio();
    await gamePage.goto();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.playAt(2, 2);
    await expect(gamePage.moveRows()).toHaveCount(4);
    expect(errors).toEqual([]);
  },
);
