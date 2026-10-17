import type { Locator, Page } from "@playwright/test";
import { copy } from "@/data/copy";
import { BasePage } from "./base.page";

export type StartOptions = {
  mode?: "vsAi" | "hotseat";
  level?: "easy" | "normal" | "hard";
  rule?: "blocked" | "free";
  /** Seat that moves first: "one" is "Bạn" / "Người 1", "two" is "Máy" / "Người 2". */
  first?: "one" | "two";
};

/** Desktop cell size (CELL_DEFAULT_DESKTOP), and the one used when the canvas is ≤ 640px wide (CELL_DEFAULT_MOBILE). */
export const CELL_DESKTOP = 32;
export const CELL_MOBILE = 28;

/**
 * The one screen of Duck Caro: header, start overlay, two-seat bar, the board <canvas>, the right-hand panel (≥ 1024px)
 * or the bottom bar (< 1024px).
 *
 * The board is a canvas with no element per cell. On load the camera puts cell (0, 0) in the middle of the canvas and
 * nothing moves the camera by itself afterwards, so cell (dx, dy) is `centre + (dx, dy) × cell` until the test pans
 * or zooms. Game state is read from the DOM around it: the move list, the seat bar, the status lines.
 */
export class GamePage extends BasePage {
  readonly settings: SettingsDialog;

  constructor(page: Page) {
    super(page);
    this.settings = new SettingsDialog(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("./");
    await this.canvas().waitFor();
  }

  /**
   * Writes localStorage entries once, before the game's first script reads them, then leaves storage alone on later
   * reloads (a sessionStorage flag), so a test can plant a saved game or settings and still watch a reload.
   */
  async plant(entries: Record<string, string>): Promise<void> {
    await this.page.addInitScript((e) => {
      if (window.sessionStorage.getItem("__planted") !== null) return;
      window.sessionStorage.setItem("__planted", "1");
      for (const [k, v] of Object.entries(e)) window.localStorage.setItem(k, v);
    }, entries);
  }

  /**
   * Replaces the browser's Worker with one that takes every message and never answers: the engine is dead or hung
   * (NFR-REL-03). Must run before goto().
   */
  async killEngine(): Promise<void> {
    await this.page.addInitScript(() => {
      class DeadWorker extends EventTarget {
        onmessage: unknown = null;
        onerror: unknown = null;
        postMessage(): void {}
        terminate(): void {}
      }
      (window as unknown as { Worker: unknown }).Worker = DeadWorker;
    });
  }

  /** Makes every access to localStorage throw, the way a private window or blocked site data does. Before goto(). */
  async blockStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("storage blocked", "SecurityError");
        },
      });
    });
  }

  /** Storage that reads but refuses every write with QuotaExceededError (a full quota). Before goto(). */
  async fillStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Storage.prototype.setItem = function () {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      };
    });
  }

  /** Counts every message the page sends to the engine Worker (window.__engineCalls). Must run before goto(). */
  async spyEngine(): Promise<void> {
    await this.page.addInitScript(() => {
      const w = window as unknown as { __engineCalls: number };
      w.__engineCalls = 0;
      const original = Worker.prototype.postMessage;
      Worker.prototype.postMessage = function (this: Worker, ...args: Parameters<Worker["postMessage"]>) {
        w.__engineCalls += 1;
        return original.apply(this, args as [unknown, StructuredSerializeOptions]);
      } as Worker["postMessage"];
    });
  }

  async engineCalls(): Promise<number> {
    return this.page.evaluate(() => (window as unknown as { __engineCalls?: number }).__engineCalls ?? 0);
  }

  // ── header ─────────────────────────────────────────────────────────────
  header(): Locator {
    return this.page.locator("header");
  }

  /** The round badge on the right of the header: the level, or "Hai người". */
  badge(): Locator {
    return this.header().locator("span.rounded-full");
  }

  /** The sound toggle. Its name says the ACTION a press does: "Tắt âm thanh" while sound is on. */
  soundButton(): Locator {
    return this.header().getByRole("button", { name: /^(Tắt|Bật) âm thanh$/ });
  }

  settingsButton(): Locator {
    return this.header().getByRole("button", { name: copy.header.settings, exact: true });
  }

  async openSettings(): Promise<SettingsDialog> {
    await this.settingsButton().click();
    await this.settings.root().waitFor();
    return this.settings;
  }

  // ── start overlay ──────────────────────────────────────────────────────
  startButton(): Locator {
    return this.page.getByRole("button", { name: copy.start.start, exact: true });
  }

  /** A segment button of one start-overlay group (Chế độ, Mức khó, Luật thắng, Ai đi trước). */
  option(group: string, name: string | RegExp): Locator {
    return this.page.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
  }

  modeOption(mode: "vsAi" | "hotseat"): Locator {
    return this.option(copy.start.mode, mode === "vsAi" ? copy.start.vsAi : copy.start.hotseat);
  }

  levelGroup(): Locator {
    return this.page.getByRole("group", { name: copy.start.level, exact: true });
  }

  levelOption(level: "easy" | "normal" | "hard"): Locator {
    return this.option(copy.start.level, copy.level[level]);
  }

  ruleOption(rule: "blocked" | "free"): Locator {
    return this.option(copy.start.rule, copy.rule[rule]);
  }

  /** "Ai đi trước" buttons; their names are the seat names of the chosen mode (Bạn/Máy or Người 1/Người 2). */
  firstOptions(): Locator {
    return this.page.getByRole("group", { name: copy.start.firstMove, exact: true }).getByRole("button");
  }

  /** The sentence under the rule picker that says what the chosen rule means. */
  ruleHint(): Locator {
    return this.page.getByText(new RegExp(`^(${escape(copy.rule.blockedHint)}|${escape(copy.rule.freeHint)})$`));
  }

  /** The one-line record under the start button for the chosen level ("1 thắng · 0 thua · 0 bỏ"), when it has games. */
  startStatsLine(): Locator {
    return this.startButton().locator("xpath=following-sibling::p[1]");
  }

  /** Picks every option given, then presses Bắt đầu ván mới. Level defaults to Dễ: the easy engine answers in ms. */
  async startGame(opts: StartOptions = {}): Promise<void> {
    await this.startButton().waitFor();
    // Mode first: it shows or hides the level group.
    if (opts.mode !== undefined) await this.modeOption(opts.mode).click();
    if (opts.mode !== "hotseat") await this.levelOption(opts.level ?? "easy").click();
    if (opts.rule !== undefined) await this.ruleOption(opts.rule).click();
    if (opts.first !== undefined) await this.firstOptions().nth(opts.first === "one" ? 0 : 1).click();
    await this.startButton().click();
    await this.startButton().waitFor({ state: "hidden" });
  }

  // ── board ──────────────────────────────────────────────────────────────
  canvas(): Locator {
    return this.page.locator("canvas");
  }

  /** The cell size the game starts with for this canvas width (no zoom yet). */
  async defaultCell(): Promise<number> {
    const box = await this.canvasBox();
    return box.width <= 640 ? CELL_MOBILE : CELL_DESKTOP;
  }

  async canvasBox(): Promise<{ x: number; y: number; width: number; height: number }> {
    const box = await this.canvas().boundingBox();
    if (box === null) throw new Error("canvas has no box");
    return box;
  }

  /** Point inside the canvas (canvas coordinates) at the centre of cell (dx, dy), for an unpanned camera. */
  async cellPoint(dx: number, dy: number, cell?: number): Promise<{ x: number; y: number }> {
    const box = await this.canvasBox();
    const size = cell ?? (await this.defaultCell());
    return { x: box.width / 2 + dx * size, y: box.height / 2 + dy * size };
  }

  /** Clicks cell (dx, dy) with a real mouse. */
  async playAt(dx: number, dy: number, cell?: number): Promise<void> {
    await this.canvas().click({ position: await this.cellPoint(dx, dy, cell) });
  }

  /** Clicks a series of cells in order (hot-seat: both seats take turns). */
  async playAll(cells: readonly (readonly [number, number])[]): Promise<void> {
    for (const [x, y] of cells) await this.playAt(x, y);
  }

  /** Mouse drag on the board from one canvas point by (dx, dy) pixels, in small steps like a hand. */
  async drag(from: { x: number; y: number }, dx: number, dy: number): Promise<void> {
    const box = await this.canvasBox();
    await this.page.mouse.move(box.x + from.x, box.y + from.y);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + from.x + dx, box.y + from.y + dy, { steps: 8 });
    await this.page.mouse.up();
  }

  /** Mouse wheel over a canvas point: negative `notches` zooms in, positive zooms out (one notch = one wheel event). */
  async wheel(at: { x: number; y: number }, notches: number): Promise<void> {
    const box = await this.canvasBox();
    await this.page.mouse.move(box.x + at.x, box.y + at.y);
    for (let i = 0; i < Math.abs(notches); i += 1) await this.page.mouse.wheel(0, notches < 0 ? -100 : 100);
  }

  /** RGB of the canvas pixel at a canvas point, read from the backing store (accounts for devicePixelRatio). */
  async pixel(at: { x: number; y: number }): Promise<[number, number, number]> {
    return this.canvas().evaluate((c: HTMLCanvasElement, p) => {
      const dpr = window.devicePixelRatio || 1;
      const d = c.getContext("2d")!.getImageData(Math.round(p.x * dpr), Math.round(p.y * dpr), 1, 1).data;
      return [d[0]!, d[1]!, d[2]!] as [number, number, number];
    }, at);
  }

  /** A hash of the whole canvas image: changes whenever anything drawn changes. */
  async canvasHash(): Promise<string> {
    return this.canvas().evaluate((c: HTMLCanvasElement) => {
      const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
      let h = 0;
      for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]!) | 0;
      return `${c.width}x${c.height}:${h}`;
    });
  }

  /** The "Đánh" button a preview mark (touch tap or hint) puts next to the previewed cell. */
  placeButton(): Locator {
    return this.page.getByRole("button", { name: copy.controls.place, exact: true });
  }

  // ── two-seat bar ───────────────────────────────────────────────────────
  /** The bar above the board: two halves, the active one bold and underlined, and the move count chip. */
  seatBar(): Locator {
    return this.page.locator("div:has(> span > span.sr-only)");
  }

  seat(side: "one" | "two"): Locator {
    return this.seatBar().locator(":scope > div").nth(side === "one" ? 0 : 1);
  }

  // ── right-hand panel (desktop ≥ 1024px) ────────────────────────────────
  panel(): Locator {
    return this.page.locator("aside");
  }

  panelButton(name: string): Locator {
    return this.panel().getByRole("button", { name, exact: true });
  }

  /** The panel's status line: last move, machine thinking, hints, errors (role=status, aria-live=polite). */
  notice(): Locator {
    return this.panel().locator("div[role=status]");
  }

  /** The second live region: where the keyboard cursor is and whether that cell is taken. */
  cursorLive(): Locator {
    return this.panel().locator("p[role=status]");
  }

  moveRows(): Locator {
    return this.panel().locator("ol li");
  }

  /** Coordinates of every move in the list, in order, parsed from the "  0,  −1" column. */
  async moves(): Promise<[number, number][]> {
    const rows = await this.moveRows().allInnerTexts();
    return rows.map((row) => {
      const m = row.replace(/−/g, "-").match(/(-?\d+),\s*(-?\d+)\s*$/);
      if (m === null) throw new Error(`unreadable move row: ${row}`);
      return [Number(m[1]), Number(m[2])];
    });
  }

  /** Title of the end-of-game block in the panel ("Người 1 thắng", "Bạn đã bỏ ván"…). */
  resultTitle(): Locator {
    return this.panel().locator("p.text-xl");
  }

  /** One row of the panel's stats table: "Dễ" + "chưa chơi" or "1 thắng · 0 thua · 0 bỏ". */
  statsRow(level: "easy" | "normal" | "hard"): Locator {
    return this.panel().getByText(copy.level[level], { exact: true }).locator("..");
  }

  statsTitle(): Locator {
    return this.panel().getByText(copy.stats.title, { exact: true });
  }

  async resign(): Promise<void> {
    await this.panelButton(copy.controls.resign).click();
  }

  async undo(): Promise<void> {
    await this.panelButton(copy.controls.undo).click();
  }

  async hint(): Promise<void> {
    await this.panelButton(copy.controls.hint).click();
  }

  // ── review (desktop panel) ─────────────────────────────────────────────
  async enterReview(): Promise<void> {
    await this.panelButton(copy.result.review).click();
  }

  reviewPosition(): Locator {
    return this.panel().getByText(/^\d+ \/ \d+$/);
  }

  reviewRows(): Locator {
    return this.panel().locator("ol button");
  }

  reviewNav(name: "first" | "prev" | "next" | "last"): Locator {
    return this.panel().getByRole("button", { name: copy.review[name], exact: true });
  }

  // ── narrow layout (< 1024px) ───────────────────────────────────────────
  /** The bottom control row shown below 1024px (Hoàn · Gợi ý · Giữa · Bỏ ván). */
  bottomBar(): Locator {
    return this.page.locator("main div.h-16");
  }

  /** The status line above the bottom bar below 1024px. */
  noticeBar(): Locator {
    return this.page.locator("main div.lg\\:hidden div[role=status]");
  }

  // ── storage and theme ──────────────────────────────────────────────────
  async storage(): Promise<Record<string, string>> {
    return this.page.evaluate(() => {
      const out: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const k = window.localStorage.key(i)!;
        out[k] = window.localStorage.getItem(k)!;
      }
      return out;
    });
  }

  /** `data-theme` on <html>: "light", "dark", or null when following the system. */
  async themeAttr(): Promise<string | null> {
    return this.page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  }

  /** The page background token (--paper) as the CSS resolves it right now. */
  async paper(): Promise<string> {
    return this.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--paper").trim());
  }
}

/** Cài đặt: a bottom sheet below 1024px, a right-hand panel from 1024px. */
export class SettingsDialog {
  constructor(readonly page: Page) {}

  root(): Locator {
    return this.page.getByRole("dialog", { name: copy.settings.title });
  }

  /** A segment button inside one labelled group of the dialog (Giao diện, Bộ quân, Mức khó mặc định, Luật mặc định). */
  option(group: string, name: string | RegExp): Locator {
    return this.root().getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
  }

  soundCheckbox(): Locator {
    return this.root().getByRole("checkbox");
  }

  closeButton(): Locator {
    return this.root().getByRole("button", { name: copy.settings.close, exact: true });
  }

  async close(): Promise<void> {
    await this.closeButton().click();
    await this.root().waitFor({ state: "hidden" });
  }

  clearAllButton(): Locator {
    return this.root().getByRole("button", { name: copy.settings.clearAll, exact: true });
  }

  confirmClearButton(): Locator {
    return this.root().getByRole("button", { name: copy.settings.clearAllConfirm, exact: true });
  }

  cancelClearButton(): Locator {
    return this.root().getByRole("button", { name: copy.settings.cancel, exact: true });
  }
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
