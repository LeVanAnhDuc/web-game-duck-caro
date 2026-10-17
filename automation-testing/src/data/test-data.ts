// Constants and generators for test input. No .env, no network: values only.

/** localStorage keys of the game (../client/src/game/storage/keys.ts, STORAGE_VERSION 'v2', owner 'local'). */
export const storageKey = {
  currentGame: "gomoku:v2:local:currentGame",
  stats: "gomoku:v2:local:stats",
  settings: "gomoku:v2:settings",
  /** Every key the game owns starts with this (ALL_VERSIONS_PREFIX). */
  prefix: "gomoku:",
} as const;

export type Seat = "one" | "two";
export type Level = "easy" | "normal" | "hard";
export type Rule = "blocked" | "free";
export type Cell = readonly [number, number];

const VS_AI = { one: "human", two: "engine" } as const;
const HOTSEAT = { one: "human", two: "human" } as const;

/**
 * A saved game in the shape ../client/src/game/storage/localGameRepository.ts parses (SavedGame). `moves` alternate
 * starting with `first`. Used to plant a position the game resumes from on load, instead of playing it out.
 */
export function savedGame(opts: {
  moves: readonly Cell[];
  first?: Seat;
  level?: Level;
  hotseat?: boolean;
  rule?: Rule;
}): string {
  const first = opts.first ?? "one";
  const other: Seat = first === "one" ? "two" : "one";
  return JSON.stringify({
    moves: opts.moves.map(([x, y], i) => ({ at: { x, y }, side: i % 2 === 0 ? first : other })),
    first,
    level: opts.level ?? "easy",
    mode: opts.hotseat ? HOTSEAT : VS_AI,
    rule: opts.rule ?? "blocked",
    savedAt: new Date("2026-10-17T00:00:00Z").toISOString(),
  });
}

/** Interleave two seats' cells into one move order: a[0], b[0], a[1], b[1]… (a may be one longer). */
export function interleave(a: readonly Cell[], b: readonly Cell[]): Cell[] {
  const out: Cell[] = [];
  for (let i = 0; i < a.length; i += 1) {
    out.push(a[i]!);
    if (i < b.length) out.push(b[i]!);
  }
  return out;
}

/** Stats in the shape the repository stores (StatsByLevel). */
export function statsBlob(partial: Partial<Record<Level, { wins?: number; losses?: number; resigns?: number }>>): string {
  const one = (l: Level) => ({ wins: 0, losses: 0, resigns: 0, ...partial[l] });
  return JSON.stringify({ easy: one("easy"), normal: one("normal"), hard: one("hard") });
}

/** Settings in the shape settingsStore parses; every field must be valid or the whole blob falls back to defaults. */
export function settingsBlob(
  partial: Partial<{ sound: boolean; defaultLevel: Level; theme: string; pieceSet: string; defaultRule: Rule }> = {},
): string {
  return JSON.stringify({
    sound: true,
    defaultLevel: "normal",
    theme: "system",
    pieceSet: "pencil",
    defaultRule: "blocked",
    ...partial,
  });
}

/** The page background token in each palette (../client/src/app/globals.css, MASTER.md §1–§2). */
export const paper = { light: "#f7f3e8", dark: "#191c20" } as const;

/** Relative brightness 0–255 of an RGB pixel (Rec. 601 weights): enough to tell a paper page from a dark one. */
export function luma([r, g, b]: readonly [number, number, number]): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * The flag-on export's Ducker ID settings (../client/scripts/build-e2e.mjs) and the profile the fake issuer returns.
 * The issuer never resolves: every request to it is answered by the fakeIssuer fixture.
 */
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  pkceKey: "ducker.pkce",
  user: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
} as const;
