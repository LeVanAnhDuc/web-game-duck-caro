'use client';

// libs
import { useEffect, useMemo, useState } from 'react';
// types
import type { GameStatus, Level, Side } from '@/game/core/types';
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
import { ReviewPane } from './components/ReviewPane';
import { StatusLine } from './components/StatusLine';
import { WinSheet } from './components/WinSheet';
import { BoardStage } from './mains/BoardStage';
import { Header } from './mains/Header';
import { SettingsSheet } from './mains/SettingsSheet';
import { StartOverlay } from './mains/StartOverlay';
import { StatsPanel } from './mains/StatsPanel';
// ghosts
import { ApplyDefaultLevel } from './ghosts/ApplyDefaultLevel';
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
  const [first, setFirst] = useState<Side>('human');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { settings, loaded: settingsLoaded, update: updateSettings } = useSettings();

  const engine = useMemo(() => createWorkerEngine(makeRng(ENGINE_SEED)), []);
  // Worker phải bị đóng khi component rời đi, nếu không mỗi lần hot-reload để lại
  // một luồng còn sống đang giữ vài chục MB bảng ứng viên.
  useEffect(() => () => engine.dispose(), [engine]);

  // Bản local hôm nay; ngày ghép Ducker ID đổi đúng dòng này (ADR-0006).
  const repository = useMemo(() => createLocalGameRepository(), []);
  const persistence = usePersistence(repository);

  const game = useGame(engine, { first: 'human', level });

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
  });

  const undo = () => {
    board.clearPreview();
    game.undoMove();
  };

  const start = (options: { first: Side; level: Level }) => {
    setLevel(options.level);
    setFirst(options.first);
    game.restart(options);
    setStarted(true);
  };

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
      game.state.toMove === 'human' &&
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
        onSave={persistence.save}
      />
      <RecordResult
        status={status}
        moveCount={total}
        level={level}
        onRecord={persistence.record}
      />
      <PlayMoveSound
        enabled={settings.sound}
        started={started}
        moves={game.state.moves}
        status={status}
      />

      <Header
        levelLabel={LEVEL_LABEL[level]}
        soundOn={settings.sound}
        onToggleSound={() => updateSettings({ ...settings, sound: !settings.sound })}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <BoardStage board={board} moves={shownMoves} onHint={game.askHint} onUndo={undo} />
          {!started && (
            <StartOverlay
              stats={persistence.stats}
              defaultLevel={settings.defaultLevel}
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
              <CursorLive cursor={board.cursor} moves={shownMoves} />
              <StatusLine
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
              <StatusLine
                state={game.state}
                thinking={game.thinking}
                notice={game.notice}
                variant="panel"
              />
              <MoveList moves={game.state.moves} currentAt={null} variant="panel" />
              <CursorLive cursor={board.cursor} moves={shownMoves} />
              <StatsPanel stats={persistence.stats} level={level} />
              <WinSheet {...winProps} variant="panel" />
              <Controls orientation="column" {...controlProps} />
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
