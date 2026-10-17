// Text the tests assert on, copied verbatim with its source path, so a copy change is fixed here, not in specs.
//   UI text: ../client/src/lib/strings.ts (the game has one locale, Vietnamese, and no server messages)

/** U+2212, the real minus the move list and the cursor region print (strings.ts → `minus`). */
export const MINUS = "−";

const minus = (v: number): string => String(v).replace("-", MINUS);

export const copy = {
  // strings.ts → appName, appTagline
  appName: "Duck Caro",
  tagline: "Đánh caro trên một bàn không có biên — với máy, hoặc với người ngồi cạnh.",
  start: {
    // strings.ts → labelMode, modeVsAi, modeHotseat, labelLevel, labelRule, labelFirstMove, start
    mode: "Chế độ",
    vsAi: "Đấu máy",
    hotseat: "Hai người",
    level: "Mức khó",
    rule: "Luật thắng",
    firstMove: "Ai đi trước",
    start: "Bắt đầu ván mới",
  },
  level: {
    // strings.ts → levelEasy / levelNormal / levelHard
    easy: "Dễ",
    normal: "Thường",
    hard: "Khó",
  },
  rule: {
    // strings.ts → ruleBlocked, ruleFree, ruleBlockedHint, ruleFreeHint
    blocked: "Caro Việt",
    free: "Tự do",
    blockedHint: "Năm quân liền là thắng — trừ khi bị chặn cả hai đầu.",
    freeHint: "Năm quân liền là thắng, kể cả khi bị chặn cả hai đầu.",
  },
  seat: {
    // strings.ts → you, machine, playerOne, playerTwo (seatName)
    you: "Bạn",
    machine: "Máy",
    one: "Người 1",
    two: "Người 2",
  },
  controls: {
    // strings.ts → undo, hint, recenter, place, resign
    undo: "Hoàn",
    hint: "Gợi ý",
    recenter: "Giữa",
    place: "Đánh",
    resign: "Bỏ ván",
  },
  notice: {
    // strings.ts → aiThinking, cellOccupied, aiGaveUpThinking, dragHint, hintThinking, hintAt, youLose
    aiThinking: "Máy đang nghĩ…",
    cellOccupied: "Ô đó đã có quân",
    aiGaveUp: "Máy không trả lời kịp — thử đánh lại một nước",
    dragHint: "Kéo để di chuyển bàn · lăn chuột để thu phóng",
    hintThinking: "Đang tìm gợi ý…",
    hintAt: /^Gợi ý: đánh ở (-?\d+), (-?\d+)\.$/,
    // strings.ts → seatMovedAt(who, x, y), seatWonAt(who, x, y), aiPlacedAt(x, y) — plain "-" here, not U+2212
    movedAt: (who: string, x: number, y: number) => `${who} đánh ở ${x}, ${y}.`,
    wonAt: (who: string, x: number, y: number) => `${who} đánh ở ${x}, ${y} và thắng.`,
    aiPlacedAt: (x: number, y: number) => `Máy đánh ở ${x}, ${y}. Lượt bạn.`,
  },
  result: {
    // strings.ts → seatWins(who), seatResigned(who), moveCount(n), playAgain, review
    wins: (who: string) => `${who} thắng`,
    resigned: (who: string) => `${who} đã bỏ ván`,
    moveCount: (n: number) => `nước ${n}`,
    playAgain: "Chơi lại",
    review: "Xem lại",
  },
  stats: {
    // strings.ts → statsTitle, statsWinShort, statsLossShort, statsResignShort, statsNoGames (StatsPanel / StatsLine)
    title: "Thành tích",
    line: (wins: number, losses: number, resigns: number) => `${wins} thắng · ${losses} thua · ${resigns} bỏ`,
    none: "chưa chơi",
  },
  review: {
    // strings.ts → reviewing, exitReview, reviewPosition(n, total), firstMove, prevMove, nextMove, lastMove
    reviewing: "Đang xem lại",
    exit: "Thoát xem lại",
    position: (n: number, total: number) => `${n} / ${total}`,
    first: "Về nước đầu",
    prev: "Nước trước",
    next: "Nước sau",
    last: "Tới nước cuối",
  },
  moveList: {
    // strings.ts → moveListTitle, moveCoord(x, y): U+2212 minus, each coordinate right-aligned to 3 chars
    title: "Nước đi",
    coord: (x: number, y: number) => `${minus(x).padStart(3, " ")}, ${minus(y).padStart(3, " ")}`,
  },
  header: {
    // strings.ts → soundOff, soundOn, settings
    soundOff: "Tắt âm thanh",
    soundOn: "Bật âm thanh",
    settings: "Cài đặt",
  },
  board: {
    // strings.ts → boardKeyboardLabel (the canvas aria-label)
    label: "Bàn caro. Mũi tên dịch con trỏ, Enter đánh, Shift và mũi tên kéo bàn, Home về giữa.",
  },
  cursor: {
    // strings.ts → cursorEmpty(x, y), cursorTakenBy(who, x, y) — U+2212 minus
    empty: (x: number, y: number) => `Con trỏ ở ${minus(x)}, ${minus(y)}. Ô trống.`,
    takenBy: (who: string, x: number, y: number) =>
      `Con trỏ ở ${minus(x)}, ${minus(y)}. Ô này là quân của ${who.toLowerCase()}.`,
  },
  settings: {
    // strings.ts → settingsTitle, settingsClose, settingsSound, soundOn/soundOff (checkbox label shows the state),
    // settingsTheme, themeLight/Dark/System, settingsPieces, piece*, settingsDefaultLevel, settingsDefaultRule,
    // keyboardTitle, keyboardHelp, clearAll, clearAllWarning, clearAllConfirm, cancel
    title: "Cài đặt",
    close: "Đóng",
    sound: "Âm thanh",
    theme: "Giao diện",
    light: "Sáng",
    dark: "Tối",
    system: "Theo máy",
    pieces: "Bộ quân",
    pieceSet: { pencil: "Bút chì", solid: "Đặc/rỗng", geo: "Hình học", duck: "Vịt" },
    defaultLevel: "Mức khó mặc định",
    defaultRule: "Luật mặc định",
    keyboardHelp: "Mũi tên dịch con trỏ · Enter đánh · Shift + mũi tên kéo bàn · + và − thu phóng · Home về giữa",
    clearAll: "Xoá toàn bộ dữ liệu",
    clearAllWarning:
      "Xoá ván đang dở và toàn bộ thành tích. Dữ liệu chỉ nằm trên máy này và không có bản sao nào — xoá là mất hẳn.",
    clearAllConfirm: "Xoá hẳn",
    cancel: "Thôi",
  },
  account: {
    // strings.ts → accountSignIn, accountSigningIn, accountMenuLabel, accountOpenProfile, accountSignOut
    signIn: "Đăng nhập",
    signingIn: "Đang đăng nhập…",
    menu: "Tài khoản Ducker ID",
    openProfile: "Mở hồ sơ Ducker ID",
    signOut: "Đăng xuất",
  },
} as const;
