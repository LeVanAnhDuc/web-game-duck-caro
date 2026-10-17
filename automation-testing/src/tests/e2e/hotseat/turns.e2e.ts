import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

const BOLD = "600";
const NORMAL = "400";

test(
  "chọn Hai người ẩn mức khó, đổi tên ghế và header ghi Hai người",
  { tag: ["@TC-HOTSEAT-001"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await expect(gamePage.levelGroup()).toBeVisible();
    await expect(gamePage.firstOptions()).toHaveText([copy.seat.you, copy.seat.machine]);

    await gamePage.modeOption("hotseat").click();
    await expect(gamePage.levelGroup()).toHaveCount(0);
    await expect(gamePage.firstOptions()).toHaveText([copy.seat.one, copy.seat.two]);

    await gamePage.modeOption("vsAi").click();
    await expect(gamePage.levelGroup()).toBeVisible();
    await expect(gamePage.firstOptions()).toHaveText([copy.seat.you, copy.seat.machine]);

    await gamePage.startGame({ mode: "hotseat" });
    await expect(gamePage.badge()).toHaveText(copy.start.hotseat);
  },
);

test(
  "hai người đánh luân phiên và máy không được hỏi nước nào",
  { tag: ["@TC-HOTSEAT-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.spyEngine();
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.one, 0, 0));
    await gamePage.playAt(1, 0);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.two, 1, 0));
    await gamePage.playAt(2, 2);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.one, 2, 2));

    expect(await gamePage.moves()).toEqual([
      [0, 0],
      [1, 0],
      [2, 2],
    ]);
    expect(await gamePage.engineCalls()).toBe(0);
  },
);

test(
  "thanh hai ghế làm nổi ghế đang tới lượt và đổi sau mỗi nước",
  { tag: ["@TC-HOTSEAT-003", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat" });
    await expect(gamePage.seat("one")).toHaveText(copy.seat.one);
    await expect(gamePage.seat("two")).toHaveText(copy.seat.two);
    await expect(gamePage.seat("one")).toHaveCSS("font-weight", BOLD);
    await expect(gamePage.seat("two")).toHaveCSS("font-weight", NORMAL);

    await gamePage.playAt(0, 0);
    await expect(gamePage.seat("two")).toHaveCSS("font-weight", BOLD);
    await expect(gamePage.seat("one")).toHaveCSS("font-weight", NORMAL);
    await expect(gamePage.seat("two")).toHaveCSS("border-bottom-style", "solid");

    await gamePage.playAt(1, 0);
    await expect(gamePage.seat("one")).toHaveCSS("font-weight", BOLD);
    await expect(gamePage.seat("two")).toHaveCSS("font-weight", NORMAL);
  },
);

test("hoàn nước lùi đúng một nước", { tag: ["@TC-HOTSEAT-004", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAt(0, 0);
  await gamePage.playAt(1, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);

  await gamePage.undo();
  // Vs the machine undo takes two; here two would delete the other person's move.
  await expect(gamePage.moveRows()).toHaveCount(1);
  expect(await gamePage.moves()).toEqual([[0, 0]]);
  await expect(gamePage.seat("two")).toHaveCSS("font-weight", BOLD);
});

test(
  "Người 2 đi trước thì nước đầu thuộc Người 2",
  { tag: ["@TC-HOTSEAT-008"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", first: "two" });
    await expect(gamePage.seat("two")).toHaveCSS("font-weight", BOLD);

    await gamePage.playAt(0, 0);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.two, 0, 0));
    await expect(gamePage.seat("one")).toHaveCSS("font-weight", BOLD);
  },
);

test(
  "tải lại giữa ván hai người tiếp tục đúng chế độ, đúng lượt, không hỏi máy",
  { tag: ["@TC-HOTSEAT-009"] },
  async ({ gamePage, page }) => {
    await gamePage.spyEngine();
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAll([
      [0, 0],
      [1, 0],
      [2, 2],
    ]);
    await expect(gamePage.moveRows()).toHaveCount(3);

    await page.reload();
    await expect(gamePage.moveRows()).toHaveCount(3);
    await expect(gamePage.badge()).toHaveText(copy.start.hotseat);
    await expect(gamePage.seat("two")).toHaveCSS("font-weight", BOLD);

    await gamePage.playAt(-3, -3);
    await expect(gamePage.notice()).toHaveText(copy.notice.movedAt(copy.seat.two, -3, -3));
    expect(await gamePage.engineCalls()).toBe(0);
  },
);
