import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

// NFR-A11Y-02 on the STATIC build (ADR-0022): Next's dev overlay is a real tab stop, so on `next dev` these would
// measure a focus tree production does not have. The suite's webServer always serves the export.

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test(
  "canvas có tên và đến được bằng Tab ngay sau hai nút header",
  { tag: ["@TC-ACCESSIBILITY-001", "@smoke"] },
  async ({ gamePage, page }) => {
    await expect(gamePage.canvas()).toHaveAccessibleName(copy.board.label);
    await page.keyboard.press("Tab");
    await expect(gamePage.soundButton()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(gamePage.settingsButton()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(gamePage.canvas()).toBeFocused();
  },
);

test(
  "chơi được chỉ bằng bàn phím, không một cú chuột nào",
  { tag: ["@TC-ACCESSIBILITY-002", "@smoke"] },
  async ({ gamePage, page }) => {
    await gamePage.levelOption("easy").focus();
    await page.keyboard.press("Enter");
    await gamePage.startButton().focus();
    await page.keyboard.press("Enter");
    await expect(gamePage.startButton()).toBeHidden();

    // From here on only the keyboard, and focus reaches the canvas by real Tab presses.
    for (let i = 0; i < 12 && !(await gamePage.canvas().evaluate((el) => el === document.activeElement)); i += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(gamePage.canvas()).toBeFocused();

    await page.keyboard.press("ArrowRight"); // first arrow shows the cursor on 0,0
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(gamePage.moveRows()).toHaveCount(2);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press(" ");
    await expect(gamePage.moveRows()).toHaveCount(4);
    const moves = await gamePage.moves();
    expect(moves[0]).toEqual([1, 1]);
    expect(moves[2]).toEqual([1, -1]);
  },
);

test(
  "vùng live đọc ô trống hoặc quân của ai trước khi đánh",
  { tag: ["@TC-ACCESSIBILITY-003"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame();
    await gamePage.canvas().focus();
    await page.keyboard.press("ArrowRight");
    await expect(gamePage.cursorLive()).toHaveText(copy.cursor.empty(0, 0));

    await page.keyboard.press("Enter");
    await expect(gamePage.moveRows()).toHaveCount(2);
    await expect(gamePage.cursorLive()).toHaveText(copy.cursor.takenBy(copy.seat.you, 0, 0));

    const [rx, ry] = (await gamePage.moves())[1]!;
    for (let i = 0; i < Math.abs(rx); i += 1) await page.keyboard.press(rx > 0 ? "ArrowRight" : "ArrowLeft");
    for (let i = 0; i < Math.abs(ry); i += 1) await page.keyboard.press(ry > 0 ? "ArrowDown" : "ArrowUp");
    await expect(gamePage.cursorLive()).toHaveText(copy.cursor.takenBy(copy.seat.machine, rx, ry));
  },
);

test(
  "Shift + mũi tên kéo bàn, không đánh quân, con trỏ giữ chỗ trên màn hình",
  { tag: ["@TC-ACCESSIBILITY-004"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.canvas().focus();
    await page.keyboard.press("ArrowRight");
    for (let i = 0; i < 6; i += 1) await page.keyboard.press("Shift+ArrowRight");
    await expect(gamePage.moveRows()).toHaveCount(0);
    await expect(gamePage.cursorLive()).toHaveText(copy.cursor.empty(6, 0));

    // The board moved under the cursor, so the cursor's cell is still in the middle of the screen.
    await gamePage.canvas().click({ position: await gamePage.cellPoint(0, 0) });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[6, 0]]);
  },
);

test("phím + và − thu phóng quanh giữa khung nhìn", { tag: ["@TC-ACCESSIBILITY-005"] }, async ({ gamePage, page }) => {
  await gamePage.startGame({ mode: "hotseat" });
  const centre = await gamePage.cellPoint(0, 0);
  await gamePage.canvas().focus();
  await page.keyboard.press("+"); // 32 → 36px
  await gamePage.canvas().click({ position: { x: centre.x + 2 * 36, y: centre.y } });
  await expect(gamePage.moveRows()).toHaveCount(1);
  expect((await gamePage.moves())[0]).toEqual([2, 0]);

  await gamePage.canvas().focus();
  await page.keyboard.press("-"); // 36 → 32px
  await page.keyboard.press("-"); // 32 → 28px
  await gamePage.canvas().click({ position: { x: centre.x - 2 * 28, y: centre.y } });
  await expect(gamePage.moveRows()).toHaveCount(2);
  expect((await gamePage.moves())[1]).toEqual([-2, 0]);
});

test("phím Home đưa mọi quân về khung nhìn", { tag: ["@TC-ACCESSIBILITY-006"] }, async ({ gamePage, page }) => {
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(1);
  await gamePage.canvas().focus();
  for (let i = 0; i < 10; i += 1) await page.keyboard.press("Shift+ArrowLeft");
  await page.keyboard.press("Home");

  await gamePage.canvas().click({ position: await gamePage.cellPoint(0, 0) });
  await expect(gamePage.notice()).toHaveText(copy.notice.cellOccupied);
  await expect(gamePage.moveRows()).toHaveCount(1);
});

test("phím h xin gợi ý và u hoàn nước", { tag: ["@TC-ACCESSIBILITY-007"] }, async ({ gamePage, page }) => {
  await gamePage.startGame();
  await gamePage.canvas().focus();
  await page.keyboard.press("Enter");
  await expect(gamePage.moveRows()).toHaveCount(2);

  await page.keyboard.press("h");
  await expect(gamePage.notice()).toHaveText(copy.notice.hintAt, { timeout: 15_000 });
  await expect(gamePage.moveRows()).toHaveCount(2);

  await page.keyboard.press("u");
  await expect(gamePage.moveRows()).toHaveCount(0);
});

test(
  "con trỏ đi ra khỏi khung nhìn thì khung nhìn đi theo",
  { tag: ["@TC-ACCESSIBILITY-008"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.canvas().focus();
    await page.keyboard.press("ArrowRight");
    for (let i = 0; i < 20; i += 1) await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[20, 0]]);

    // The 1280px board shows about 15 cells either side of the centre: cell 20 is only on screen if the view moved.
    await gamePage.canvas().click({ position: await gamePage.cellPoint(0, 0) });
    await expect(gamePage.moveRows()).toHaveCount(2);
    expect((await gamePage.moves())[1]).not.toEqual([0, 0]);
  },
);

test("phím lạ không giữ focus, Tab vẫn rời canvas", { tag: ["@TC-ACCESSIBILITY-009"] }, async ({ gamePage, page }) => {
  await gamePage.canvas().focus();
  await page.keyboard.press("q");
  await page.keyboard.press("Tab");
  await expect(gamePage.canvas()).not.toBeFocused();
});
