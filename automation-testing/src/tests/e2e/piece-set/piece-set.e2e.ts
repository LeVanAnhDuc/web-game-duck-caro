import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

const SETS = [
  copy.settings.pieceSet.pencil,
  copy.settings.pieceSet.solid,
  copy.settings.pieceSet.geo,
  copy.settings.pieceSet.duck,
] as const;

const exactly = (name: string) => new RegExp(`^${name.replace("/", "\\/")}$`);

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test(
  "bốn bộ quân, mặc định Bút chì, mỗi ô vẽ hai hình khác nhau",
  { tag: ["@TC-PIECESET-001"] },
  async ({ gamePage }) => {
    const settings = await gamePage.openSettings();
    const group = settings.root().getByRole("group", { name: copy.settings.pieces, exact: true });
    await expect(group.getByRole("button")).toHaveText([...SETS]);
    await expect(settings.option(copy.settings.pieces, exactly(SETS[0]))).toHaveAttribute("aria-pressed", "true");

    const seen = new Set<string>();
    for (const name of SETS) {
      const shapes = await gamePage.glyphShapes(settings.option(copy.settings.pieces, exactly(name)));
      expect(shapes).toHaveLength(2);
      expect(shapes[0]).not.toBe(shapes[1]);
      seen.add(shapes.join("|"));
    }
    expect(seen.size).toBe(4);
  },
);

test(
  "chọn bộ quân vẽ lại quân trên bàn ngay, chọn lại bộ cũ cho hình cũ",
  { tag: ["@TC-PIECESET-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAll([
      [0, 0],
      [1, 0],
    ]);
    await expect(gamePage.moveRows()).toHaveCount(2);
    const pencil = await gamePage.canvasHash();

    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.pieces, exactly(copy.settings.pieceSet.duck)).click();
    await expect.poll(() => gamePage.canvasHash()).not.toBe(pencil);

    await settings.option(copy.settings.pieces, exactly(copy.settings.pieceSet.pencil)).click();
    await expect.poll(() => gamePage.canvasHash()).toBe(pencil);
  },
);

test("bộ quân đã chọn sống qua tải lại", { tag: ["@TC-PIECESET-003"] }, async ({ gamePage, page }) => {
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAt(0, 0);
  let settings = await gamePage.openSettings();
  await settings.option(copy.settings.pieces, exactly(copy.settings.pieceSet.duck)).click();
  await settings.close();

  await page.reload();
  await expect(gamePage.moveRows()).toHaveCount(1);
  settings = await gamePage.openSettings();
  await expect(settings.option(copy.settings.pieces, exactly(copy.settings.pieceSet.duck))).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("đổi bộ quân không đổi ván", { tag: ["@TC-PIECESET-004"] }, async ({ gamePage }) => {
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAll([
    [0, 0],
    [1, 0],
    [2, 2],
  ]);
  const before = await gamePage.moves();

  const settings = await gamePage.openSettings();
  for (const name of [...SETS.slice(1), SETS[0]]) {
    await settings.option(copy.settings.pieces, exactly(name)).click();
  }
  await settings.close();

  expect(await gamePage.moves()).toEqual(before);
  await expect(gamePage.seat("two")).toHaveCSS("font-weight", "600");
  await gamePage.playAt(-3, -3);
  await expect(gamePage.moveRows()).toHaveCount(4);
});

test(
  "ở mọi bộ, quân của mỗi ghế giữ đúng màu của ghế",
  { tag: ["@TC-PIECESET-005"] },
  async ({ gamePage }) => {
    const settings = await gamePage.openSettings();
    const one = new Set<string>();
    const two = new Set<string>();
    for (const name of SETS) {
      const [a, b] = await gamePage.glyphColours(settings.option(copy.settings.pieces, exactly(name)));
      one.add(a!);
      two.add(b!);
    }
    expect(one.size).toBe(1);
    expect(two.size).toBe(1);
    expect([...one][0]).not.toBe([...two][0]);
  },
);

test(
  "thanh hai ghế và màn bắt đầu vẽ quân bằng bộ đang chọn",
  { tag: ["@TC-PIECESET-006"] },
  async ({ gamePage }) => {
    const settings = await gamePage.openSettings();
    const geo = settings.option(copy.settings.pieces, exactly(copy.settings.pieceSet.geo));
    await geo.click();
    const [geoOne] = await gamePage.glyphShapes(geo);
    await settings.close();

    expect(await gamePage.glyphShapes(gamePage.firstOptions().nth(0))).toEqual([geoOne]);
    await gamePage.startGame({ mode: "hotseat" });
    expect(await gamePage.glyphShapes(gamePage.seat("one"))).toEqual([geoOne]);
  },
);
