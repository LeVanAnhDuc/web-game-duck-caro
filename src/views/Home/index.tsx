'use client';

// libs
import { useEffect, useMemo, useState } from 'react';
// types
import {
  DEFAULT_RULE,
  hasEngine,
  VS_AI,
  type GameStatus,
  type Level,
  type Mode,
  type Rule,
  type Side,
} from '@/game/core/types';
// game
import { makeRng } from '@/game/ai/rng';
import { createWorkerEngine } from '@/game/ai/workerEngine';
import { createLocalGameRepository } from '@/game/storage/localGameRepository';
// hooks
import { useBoardCanvas, useGame, usePersistence, useSettings } from '@/hooks';
// components
import { Controls } from './components/Controls';
import { CursorLive } from './components/CursorLive';
import { MoveList } from './components/MoveList';
import { NoticeLine } from './components/NoticeLine';
import { ReviewPane } from './components/ReviewPane';
import { SeatBar } from './components/SeatBar';
import { WinSheet } from './components/WinSheet';
import { BoardStage } from './mains/BoardStage';
import { Header } from './mains/Header';
import { SettingsSheet } from './mains/SettingsSheet';
import { StartOverlay } from './mains/StartOverlay';
import { StatsPanel } from './mains/StatsPanel';
// ghosts
import { ApplyDefaultLevel } from './ghosts/ApplyDefaultLevel';
import { ApplyTheme } from './ghosts/ApplyTheme';
import { PlayMoveSound } from './ghosts/PlayMoveSound';
import { RecordResult } from './ghosts/RecordResult';
import { ResumeSavedGame } from './ghosts/ResumeSavedGame';
import { SaveGame } from './ghosts/SaveGame';
import { ShowHintPreview } from './ghosts/ShowHintPreview';
// others
import { strings } from '@/lib/strings';

const LEVEL_LABEL: Record<Level, string> = {
  easy: strings.levelEasy,
  normal: strings.levelNormal,
  hard: strings.levelHard,
};

/** Seed cố định nên một lỗi tìm ra lúc chơi thì tái tạo được. */
const ENGINE_SEED = 1;

const PLAYING: GameStatus = { kind: 'playing' };

export function Home() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState<Level>('normal');
  const [first, setFirst] = useState<Side>('one');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { settings, loaded: settingsLoaded, update: updateSettings } = useSettings();

  const engine = useMemo(() => createWorkerEngine(makeRng(ENGINE_SEED)), []);
  // Worker phải bị đóng khi component rời đi, nếu không mỗi lần hot-reload để lại
  // một luồng còn sống đang giữ vài chục MB bảng ứng viên.
  useEffect(() => () => engine.dispose(), [engine]);

  // Bản local hôm nay; ngày ghép Ducker ID đổi đúng dòng này (ADR-0006).
  const repository = useMemo(() => createLocalGameRepository(), []);
  const persistence = usePersistence(repository);

  /*
   * `mode` và `rule` KHÔNG được giữ thêm một bản ở đây: `useGame` đã sở hữu chúng
   * (`game.mode` và `game.state.rule`). Một bản thứ hai là một bản có thể lệch, và
   * lệch ở đúng hai giá trị quyết định có gọi engine không và xử thắng thế nào.
   */
  const game = useGame(engine, {
    first: 'one',
    level,
    mode: VS_AI,
    rule: DEFAULT_RULE,
  });

  const status = game.state.status;
  const reviewAt = game.reviewAt;
  const reviewing = reviewAt !== null;
  const total = game.state.moves.length;

  /*
   * Xem lại là một PHÉP CHIẾU (design.md §2): bàn nhận `moves.slice(0, reviewAt)`.
   * Không có bản sao ván nào, nên không có gì để lệch với nguồn đúng (bất biến 1).
   *
   * `status` truyền cho bàn bị ép về 'playing' khi đang đứng GIỮA ván — nếu không,
   * nét gạch chuỗi thắng sẽ vẽ đè lên một thế bàn chưa có chuỗi đó, tức là vẽ một
   * kết quả chưa xảy ra.
   */
  const shownMoves = reviewing ? game.state.moves.slice(0, reviewAt) : game.state.moves;
  const shownStatus = reviewing && reviewAt < total ? PLAYING : status;

  const board = useBoardCanvas({
    moves: shownMoves,
    status: shownStatus,
    onPlace: game.place,
    pieceSet: settings.pieceSet,
    /*
     * Quân xem trước mang hình và màu của GHẾ ĐANG ĐI (ADR-0028) — tín hiệu
     * "tới lượt ai" thứ hai, và là tín hiệu nằm đúng chỗ mắt đang nhìn. Thanh
     * hai ghế ở trên NÓI; cái này CHO THẤY.
     */
    previewSide: game.state.toMove,
  });

  const undo = () => {
    board.clearPreview();
    game.undoMove();
  };

  const start = (options: { first: Side; level: Level; mode: Mode; rule: Rule }) => {
    setLevel(options.level);
    setFirst(options.first);
    game.restart(options);
    setStarted(true);
  };

  /*
   * Đổi chế độ hoặc luật GIỮA VÁN không làm được từ đây — không có nút nào cho
   * nó, và đó là chủ ý. Cả hai đông cứng theo ván (bất biến 14 · ADR-0025), nên
   * muốn đổi thì bỏ ván rồi bắt đầu ván mới, đi qua đúng luồng của US-04. Một
   * hộp xác nhận ở đây sẽ là con đường thứ hai tới cùng một chỗ.
   */

  /**
   * "Chơi lại" đưa về màn chọn mức, và phải DỌN ván cũ.
   *
   * Không có `resetToMenu` thì `status` giữ nguyên giá trị cũ, nên cột phải hiện đồng
   * thời màn chọn mức VÀ khối "Bạn đã bỏ ván · nước 6 · Chơi lại" của ván trước. Đây
   * là lỗi tìm ra bằng cách bấm thật, không phải bằng đọc code.
   */
  const playAgain = () => {
    board.clearPreview();
    persistence.clearGame();
    game.resetToMenu();
    setStarted(false);
  };

  /*
   * Vào xem lại thì ĐƯA KHUNG NHÌN VỀ toàn bộ ván.
   *
   * Khác với lúc đang chơi — nơi tự dịch khung nhìn là giật màn hình của người đang
   * đánh — ở đây người chơi vừa BẤM để đổi chế độ, nên thấy cả ván là điều họ mong
   * đợi. Không có dòng này thì ván có thể mở ra với một bàn trống trơn.
   */
  const startReview = () => {
    board.clearPreview();
    game.enterReview();
    board.recenter();
  };

  const reviewProps = {
    moves: game.state.moves,
    pieceSet: settings.pieceSet,
    // `reviewing` đã canh `reviewAt !== null` ở mọi chỗ dùng; `?? 0` chỉ để chiều TS.
    at: reviewAt ?? 0,
    onGoto: game.gotoMove,
    onRecenter: board.recenter,
    onExit: game.exitReview,
  };

  const controlProps = {
    canUndo: game.state.moves.length > 0 && status.kind === 'playing',
    canHint:
      started &&
      status.kind === 'playing' &&
      game.mode[game.state.toMove] === 'human' &&
      !game.thinking &&
      !game.hinting,
    canResign: started && status.kind === 'playing',
    onUndo: undo,
    onHint: game.askHint,
    onRecenter: board.recenter,
    onResign: game.giveUp,
  };

  const winProps = {
    status,
    mode: game.mode,
    moveCount: total,
    onPlayAgain: playAgain,
    onReview: startReview,
  };

  return (
    <main className="flex h-dvh flex-col">
      {/*
        Ghost = component `return null`, chỉ chạy side-effect (R-04).

        Chúng render VÔ ĐIỀU KIỆN, và giữ nguyên THỨ TỰ của các `useEffect` từng nằm
        trong file này: effect của con chạy trước effect của cha và theo đúng thứ tự
        con, nên xê dịch mấy dòng dưới đây là xê dịch thứ tự chạy thật.
      */}
      <ApplyTheme theme={settings.theme} loaded={settingsLoaded} />
      <ApplyDefaultLevel
        loaded={settingsLoaded}
        started={started}
        defaultLevel={settings.defaultLevel}
        onApply={setLevel}
      />
      <ShowHintPreview hint={game.hint} onShow={board.showPreview} />
      <ResumeSavedGame
        restored={persistence.restored}
        onResume={(saved) => {
          if (!game.resume(saved)) return false;
          setLevel(saved.level);
          setFirst(saved.first);
          setStarted(true);
          return true;
        }}
        onCorrupt={persistence.clearGame}
      />
      <SaveGame
        started={started}
        state={game.state}
        first={first}
        level={level}
        mode={game.mode}
        onSave={persistence.save}
      />
      <RecordResult
        status={status}
        moveCount={total}
        level={level}
        mode={game.mode}
        onRecord={persistence.record}
      />
      <PlayMoveSound
        enabled={settings.sound}
        started={started}
        moves={game.state.moves}
        status={status}
        mode={game.mode}
      />

      <Header
        badge={
          hasEngine(game.mode) ? LEVEL_LABEL[level] : strings.modeHotseat
        }
        soundOn={settings.sound}
        onToggleSound={() => updateSettings({ ...settings, sound: !settings.sound })}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/*
            Thanh hai ghế nằm TRONG cột bàn, không ở ngoài: ở 1440 nó sẽ trải hết
            cửa sổ và vạch chia giữa hai ghế rơi vào giữa CỬA SỔ chứ không giữa BÀN
            — mất đúng phép so "nửa nào sáng hơn" mà ADR-0028 dựa vào. Thấy được
            bằng mắt ở khổ 1440, không thấy được bằng test.

            Nó render VÔ ĐIỀU KIỆN và tự ẩn nội dung khi chưa vào ván, nên chiều cao
            khung bàn KHÔNG ĐỔI — xem ghi chú trong `SeatBar`.
          */}
          <SeatBar
            state={game.state}
            mode={game.mode}
            thinking={game.thinking}
            pieceSet={settings.pieceSet}
            visible={started}
          />
          <BoardStage board={board} moves={shownMoves} onHint={game.askHint} onUndo={undo} />
          {/*
            CHỜ cài đặt đọc xong mới dựng màn bắt đầu.

            `StartOverlay` chốt `defaultLevel` và `defaultRule` vào `useState` ở lần
            render đầu, mà lần đó `useSettings` còn đang trả `DEFAULT_SETTINGS` — nó chỉ
            đọc `localStorage` trong một effect (ADR-0001: bản build tĩnh không có
            storage lúc build). Dựng sớm thì hai mục "mặc định" trong cài đặt KHÔNG ÁP
            cho ván đầu sau mỗi lần tải trang, và chỉ đúng từ ván thứ hai — lúc "Chơi
            lại" dựng lại overlay. Cùng loại lỗi thứ tự khởi động như cú nháy giao diện
            mà `NFR-PERF-10` bắt được.

            Chờ ở đây rẻ hơn đồng bộ prop vào state: một `useEffect` sync sẽ ghi đè lựa
            chọn người chơi vừa bấm nếu cài đặt đọc xong muộn hơn cú bấm đó.
          */}
          {!started && settingsLoaded && (
            <StartOverlay
              stats={persistence.stats}
              defaultLevel={settings.defaultLevel}
              defaultRule={settings.defaultRule}
              pieceSet={settings.pieceSet}
              onStart={start}
            />
          )}

          {reviewing && <ReviewPane variant="sheet" {...reviewProps} />}

          {settingsOpen && (
            <SettingsSheet
              settings={settings}
              onChange={updateSettings}
              onClearAll={persistence.clearAll}
              onClose={() => setSettingsOpen(false)}
            />
          )}

          {!reviewing && (
            <div className="lg:hidden">
              <CursorLive cursor={board.cursor} moves={shownMoves} mode={game.mode} />
              <NoticeLine
                state={game.state}
                thinking={game.thinking}
                notice={game.notice}
                variant="bar"
              />
            </div>
          )}
        </div>

        {!reviewing && (
          <div className="lg:hidden">
            <WinSheet {...winProps} variant="sheet" />
            <Controls orientation="row" {...controlProps} />
          </div>
        )}

        <aside className="hidden w-80 flex-none flex-col border-l border-edge bg-raised shadow-panel lg:flex">
          {reviewing ? (
            <ReviewPane variant="panel" {...reviewProps} />
          ) : (
            <>
              <NoticeLine
                state={game.state}
                thinking={game.thinking}
                notice={game.notice}
                variant="panel"
              />
              <MoveList
                moves={game.state.moves}
                currentAt={null}
                variant="panel"
                pieceSet={settings.pieceSet}
              />
              <CursorLive cursor={board.cursor} moves={shownMoves} mode={game.mode} />
              {/*
                Hot-seat không vào thống kê (overview.md §4), nên một bảng "Dễ ·
                Thường · Khó" ở đây nói về một cái máy không tham gia ván nào.
              */}
              {hasEngine(game.mode) && (
                <StatsPanel stats={persistence.stats} level={level} />
              )}
              <WinSheet {...winProps} variant="panel" />
              <Controls orientation="column" {...controlProps} />
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
