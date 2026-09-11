/**
 * Toàn bộ chuỗi hiển thị của sản phẩm, tiếng Việt.
 *
 * NFR-I18N-01: không hardcode chuỗi hiển thị trong component. v1 chỉ một ngôn ngữ
 * (`overview.md` §Non-Goals), nhưng gom về một file nên thêm tiếng Anh sau là thêm
 * một file, không phải một đợt truy tìm chuỗi trong JSX.
 */
import type { Mode, Side } from '@/game/core/types';

/** Dấu trừ thật U+2212 thay cho dấu gạch bàn phím. */
const minus = (v: number): string => String(v).replace('-', '−');

export const strings = {
  appName: 'Duck Caro',
  appTagline:
    'Đánh caro trên một bàn không có biên — với máy, hoặc với người ngồi cạnh.',

  /* --- Mốc 8: chế độ, ghế, luật (FR-17 · FR-18) --- */
  labelMode: 'Chế độ',
  modeVsAi: 'Đấu máy',
  modeHotseat: 'Hai người',
  playerOne: 'Người 1',
  playerTwo: 'Người 2',
  you: 'Bạn',
  machine: 'Máy',

  labelRule: 'Luật thắng',
  ruleBlocked: 'Caro Việt',
  ruleFree: 'Tự do',
  /* Tên luật một mình không nói được luật, nên hai dòng này luôn đi kèm nó. */
  ruleBlockedHint: 'Năm quân liền là thắng — trừ khi bị chặn cả hai đầu.',
  ruleFreeHint: 'Năm quân liền là thắng, kể cả khi bị chặn cả hai đầu.',

  levelEasy: 'Dễ',
  levelNormal: 'Thường',
  levelHard: 'Khó',

  labelLevel: 'Mức khó',
  labelFirstMove: 'Ai đi trước',
  firstMoveYou: 'Bạn',
  firstMoveAi: 'Máy',
  start: 'Bắt đầu ván mới',

  undo: 'Hoàn',
  hint: 'Gợi ý',
  recenter: 'Giữa',
  place: 'Đánh',
  resign: 'Bỏ ván',

  yourTurn: 'Lượt bạn',
  aiThinking: 'Máy đang nghĩ…',
  youWin: 'Bạn thắng',
  youLose: 'Máy thắng',
  youResigned: 'Bạn đã bỏ ván',
  playAgain: 'Chơi lại',

  cellOccupied: 'Ô đó đã có quân',
  confirmHint: 'Tap lại đúng ô đó, hoặc bấm Đánh, mới thành nước thật',
  aiGaveUpThinking: 'Máy không trả lời kịp — thử đánh lại một nước',
  dragHint: 'Kéo để di chuyển bàn · lăn chuột để thu phóng',

  statsTitle: 'Thành tích',
  statsWinShort: 'thắng',
  statsLossShort: 'thua',
  statsResignShort: 'bỏ',
  statsNoGames: 'chưa chơi',
  resumed: 'Đã tiếp tục ván đang dở',
  clearAll: 'Xoá toàn bộ dữ liệu',
  clearAllWarning:
    'Xoá ván đang dở và toàn bộ thành tích. Dữ liệu chỉ nằm trên máy này và không có bản sao nào — xoá là mất hẳn.',
  clearAllConfirm: 'Xoá hẳn',
  cancel: 'Thôi',

  soundOff: 'Tắt âm thanh',
  settings: 'Cài đặt',
  boardLabel: 'Bàn caro — kéo để di chuyển, lăn chuột để thu phóng',

  moveCount: (n: number) => `nước ${n}`,
  coord: (x: number, y: number) => `${x}, ${y}`,
  placedAt: (x: number, y: number) => `Bạn đánh ở ${x}, ${y}.`,
  aiPlacedAt: (x: number, y: number) => `Máy đánh ở ${x}, ${y}. Lượt bạn.`,
  wonAt: (x: number, y: number) => `Bạn đánh ở ${x}, ${y} và thắng.`,

  /* --- Mốc 5: danh sách nước đi, xem lại ván, gợi ý --- */
  moveListTitle: 'Nước đi',
  /*
   * Dấu trừ THẬT (U+2212) và căn phải 3 ký tự. Không phải để đẹp: cột toạ độ
   * trong danh sách phải thẳng hàng, và đó chính là lý do MASTER.md §4 bắt dùng
   * font chữ số đều chiều rộng ở chỗ này. Dấu `-` của bàn phím hẹp hơn nên nó phá cột.
   */
  moveCoord: (x: number, y: number) => {
    const one = (v: number) => minus(v).padStart(3, ' ');
    return `${one(x)}, ${one(y)}`;
  },
  hintThinking: 'Đang tìm gợi ý…',
  hintAt: (x: number, y: number) => `Gợi ý: đánh ở ${x}, ${y}.`,
  hintFailed: 'Chưa tìm được gợi ý — thử lại một lượt nữa',
  review: 'Xem lại',
  reviewing: 'Đang xem lại',
  exitReview: 'Thoát xem lại',
  reviewPosition: (n: number, total: number) => `${n} / ${total}`,
  firstMove: 'Về nước đầu',
  prevMove: 'Nước trước',
  nextMove: 'Nước sau',
  lastMove: 'Tới nước cuối',

  /* --- Mốc 6: bàn phím, âm thanh, cài đặt --- */
  soundOn: 'Bật âm thanh',
  settingsTitle: 'Cài đặt',
  settingsSound: 'Âm thanh',
  settingsDefaultLevel: 'Mức khó mặc định',
  settingsClose: 'Đóng',
  /* Bàn phím phải được DẠY ở đâu đó: Shift + mũi tên là quy ước không ai tự đoán ra
     (ADR-0020), và màn cài đặt là chỗ duy nhất còn trống để nói. */
  keyboardTitle: 'Bàn phím',
  keyboardHelp:
    'Mũi tên dịch con trỏ · Enter đánh · Shift + mũi tên kéo bàn · + và − thu phóng · Home về giữa',
  boardKeyboardLabel:
    'Bàn caro. Mũi tên dịch con trỏ, Enter đánh, Shift và mũi tên kéo bàn, Home về giữa.',
  /* Dấu trừ thật ở đây không phải chuyện thẩm mỹ: trình đọc màn hình đọc U+2212
     là "trừ", còn `-` thường bị đọc là "gạch ngang" hoặc bị bỏ hẳn. */
  cursorEmpty: (x: number, y: number) => `Con trỏ ở ${minus(x)}, ${minus(y)}. Ô trống.`,
  cursorTakenYou: (x: number, y: number) =>
    `Con trỏ ở ${minus(x)}, ${minus(y)}. Ô này là quân của bạn.`,
  cursorTakenAi: (x: number, y: number) =>
    `Con trỏ ở ${minus(x)}, ${minus(y)}. Ô này là quân của máy.`,

  /**
   * Tên một ghế, ĐỌC TỪ `Mode` (ADR-0024). Đây là chỗ duy nhất biết khi nào một ghế
   * được gọi là "Máy" — bất biến 15 cấm mọi nơi khác suy ra điều đó từ tên ghế.
   */
  seatName: (side: Side, mode: Mode): string => {
    if (mode[side] === 'engine') return 'Máy';
    return mode[side === 'one' ? 'two' : 'one'] === 'engine'
      ? 'Bạn'
      : side === 'one'
        ? 'Người 1'
        : 'Người 2';
  },

  turnOf: (who: string) => `Lượt ${who}`,
  seatMovedAt: (who: string, x: number, y: number) => `${who} đánh ở ${x}, ${y}.`,
  seatWonAt: (who: string, x: number, y: number) =>
    `${who} đánh ở ${x}, ${y} và thắng.`,
  seatWins: (who: string) => `${who} thắng`,
  seatResigned: (who: string) => `${who} đã bỏ ván`,

  /* --- Mốc 8: giao diện và bộ quân (FR-19 · FR-20) --- */
  settingsTheme: 'Giao diện',
  themeLight: 'Sáng',
  themeDark: 'Tối',
  themeSystem: 'Theo máy',
  settingsPieces: 'Bộ quân',
  piecePencil: 'Bút chì',
  pieceSolid: 'Đặc/rỗng',
  pieceGeo: 'Hình học',
  pieceDuck: 'Vịt',
  settingsDefaultRule: 'Luật mặc định',
} as const;
