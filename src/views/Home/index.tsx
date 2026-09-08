'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createWorkerEngine } from '@/game/ai/workerEngine';
import { browserAudioCtor, createAudio } from '@/game/audio';
import { makeRng } from '@/game/ai/rng';
import type { GameStatus, Level, Side } from '@/game/core/types';
import { createLocalGameRepository } from '@/game/storage/localGameRepository';
import type { GameResult } from '@/game/storage/types';
import { useBoardCanvas } from '@/hooks/useBoardCanvas';
import { useGame } from '@/hooks/useGame';
import { useSettings } from '@/hooks/useSettings';
import { usePersistence } from '@/hooks/usePersistence';
import { strings } from '@/lib/strings';
import { BoardStage } from './mains/BoardStage';
import { Controls } from './mains/Controls';
import { CursorLive } from './mains/CursorLive';
import { Header } from './mains/Header';
import { MoveList } from './mains/MoveList';
import { ReviewBar } from './mains/ReviewBar';
import { SettingsSheet } from './mains/SettingsSheet';
import { StartOverlay } from './mains/StartOverlay';
import { StatsPanel } from './mains/StatsPanel';
import { StatusLine } from './mains/StatusLine';
import { WinSheet } from './mains/WinSheet';

const LEVEL_LABEL: Record<Level, string> = {
  easy: strings.levelEasy,
  normal: strings.levelNormal,
  hard: strings.levelHard,
};

/** Seed cố định nên một lỗi tìm ra lúc chơi thì tái tạo được. */
const ENGINE_SEED = 1;

const PLAYING: GameStatus = { kind: 'playing' };

/** Đầu chế độ xem lại — thay chỗ dòng lượt, vì lúc này không có lượt của ai cả. */
function ReviewHead({ at, total }: { at: number; total: number }) {
  return (
    <div className="flex flex-none items-center justify-between gap-2 border-b border-edge p-4">
      <p className="text-sm font-semibold text-ink-strong">{strings.reviewing}</p>
      <p className="font-mono text-sm text-ink-muted">
        {strings.reviewPosition(at, total)}
      </p>
    </div>
  );
}

export function Home() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState<Level>('normal');
  const [first, setFirst] = useState<Side>('human');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { settings, loaded: settingsLoaded, update: updateSettings } = useSettings();

  /*
   * Âm thanh dựng MỘT lần cho cả phiên, nhưng `AudioContext` bên trong chỉ sinh ra ở
   * tiếng đầu tiên — tức ở một cử chỉ người dùng (ADR-0021).
   */
  const audio = useMemo(() => createAudio(browserAudioCtor()), []);
  useEffect(() => {
    audio.setEnabled(settings.sound);
  }, [audio, settings.sound]);

  const engine = useMemo(() => createWorkerEngine(makeRng(ENGINE_SEED)), []);
  // Worker phải bị đóng khi component rời đi, nếu không mỗi lần hot-reload để lại
  // một luồng còn sống đang giữ vài chục MB bảng ứng viên.
  useEffect(() => () => engine.dispose(), [engine]);

  // Bản local hôm nay; ngày ghép Ducker ID đổi đúng dòng này (ADR-0006).
  const repository = useMemo(() => createLocalGameRepository(), []);
  const persistence = usePersistence(repository);

  const game = useGame(engine, { first: 'human', level });

  /*
   * Mức khó mặc định chỉ áp khi CHƯA vào ván nào. Áp giữa ván sẽ đổi mức của ván đang
   * chơi mà không hỏi gì, và `journeys.md` §US-04 chỉ đúng tên lỗi đó.
   */
  const appliedDefault = useRef(false);
  useEffect(() => {
    if (appliedDefault.current || !settingsLoaded || started) return;
    appliedDefault.current = true;
    setLevel(settings.defaultLevel);
  }, [settingsLoaded, started, settings.defaultLevel]);

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

  // Gợi ý về thì đẩy vào quân xem trước. `useGame` không biết gì về canvas, và
  // `useBoardCanvas` không biết gì về engine — chỗ nối hai bên là đúng ở đây.
  useEffect(() => {
    if (game.hint !== null) board.showPreview(game.hint);
    // `board` đổi mỗi render; chỉ `hint` mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.hint]);

  /**
   * Tiếp tục ván dở, đúng MỘT lần khi đọc xong.
   *
   * Ván lưu hỏng thì `resume` trả `false`, và ván đó bị xoá — nếu để lại, mỗi lần mở
   * app là một lần thử dựng lại rồi thất bại.
   */
  const resumeTried = useRef(false);
  useEffect(() => {
    if (resumeTried.current || persistence.restored === undefined) return;
    resumeTried.current = true;
    const saved = persistence.restored;
    if (saved === null) return;
    if (game.resume(saved)) {
      setLevel(saved.level);
      setFirst(saved.first);
      setStarted(true);
    } else {
      persistence.clearGame();
    }
    // `game` và `persistence` đổi mỗi render; chỉ `restored` mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistence.restored]);

  // Lưu sau mỗi nước. Ván kết thúc thì `save` tự xoá — không có gì để tiếp tục nữa.
  useEffect(() => {
    if (!started) return;
    persistence.save(game.state, first, level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.state, started, first, level]);

  /**
   * Ghi kết quả vào thống kê, đúng MỘT lần mỗi ván.
   *
   * `useEffect` theo `status` chạy lại ở mỗi render có `status` mới, và một ván có
   * thể render nhiều lần sau khi kết thúc (đổi kích thước cửa sổ, kéo bàn, và từ mốc
   * 5 là cả tua qua tua lại trong chế độ xem lại). Không có cái khoá này thì một ván
   * thắng đếm thành ba, và bảng thống kê sai âm thầm — vẫn là số, chỉ là số sai.
   */
  const recordedFor = useRef<number | null>(null);
  useEffect(() => {
    if (status.kind === 'playing') {
      recordedFor.current = null;
      return;
    }
    const moveCount = game.state.moves.length;
    if (recordedFor.current === moveCount) return;
    recordedFor.current = moveCount;

    const result: GameResult =
      status.kind === 'resigned' ? 'resign' : status.by === 'human' ? 'win' : 'loss';
    persistence.record(level, result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, level]);

  /*
   * Tiếng đi theo NƯỚC MỚI, không theo `status`: một `useEffect` trên `status` sẽ im
   * suốt ván và chỉ kêu lúc kết thúc. Khoá theo số nước để resize hay tua lại không
   * phát lại tiếng — cùng loại khoá như khoá chống đếm trùng thống kê.
   */
  const soundedFor = useRef(0);
  useEffect(() => {
    const count = game.state.moves.length;
    if (count === soundedFor.current) return;
    const grew = count > soundedFor.current;
    soundedFor.current = count;
    if (!grew || !started) return;

    if (status.kind === 'won') {
      if (status.by === 'human') audio.win();
      else audio.lose();
      return;
    }
    const last = game.state.moves[count - 1];
    if (last?.side === 'human') audio.place();
    else if (last?.side === 'ai') audio.reply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.state.moves, status, started]);

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

  const controlProps = {
    canUndo: game.state.moves.length > 0 && status.kind === 'playing',
    canHint:
      started &&
      status.kind === 'playing' &&
      game.state.toMove === 'human' &&
      !game.thinking &&
      !game.hinting,
    canResign: started && status.kind === 'playing',
    onUndo: () => {
      board.clearPreview();
      game.undoMove();
    },
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
      <Header
        levelLabel={LEVEL_LABEL[level]}
        soundOn={settings.sound}
        onToggleSound={() => updateSettings({ ...settings, sound: !settings.sound })}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <BoardStage
            board={board}
            moves={shownMoves}
            onHint={game.askHint}
            onUndo={() => {
              board.clearPreview();
              game.undoMove();
            }}
          />
          {!started && (
            <StartOverlay
              stats={persistence.stats}
              defaultLevel={settings.defaultLevel}
              onStart={start}
            />
          )}

          {/* Sheet xem lại neo ĐÁY, phủ lên bàn — bàn vẫn thấy được nửa trên. */}
          {reviewing && (
            <div className="absolute inset-x-0 bottom-0 flex max-h-[52%] flex-col rounded-t-[10px] border-t border-edge bg-raised shadow-sheet lg:hidden">
              <div className="flex flex-none items-center justify-between gap-2 px-4 pb-2 pt-4">
                <p className="text-sm font-semibold text-ink-strong">
                  {strings.reviewing}
                </p>
                <p className="font-mono text-sm text-ink-muted">
                  {strings.reviewPosition(reviewAt, total)}
                </p>
              </div>
              <MoveList
                moves={game.state.moves}
                currentAt={reviewAt}
                variant="sheet"
                onPick={game.gotoMove}
              />
              <ReviewBar
                at={reviewAt}
                total={total}
                variant="sheet"
                onGoto={game.gotoMove}
                onRecenter={board.recenter}
                onExit={game.exitReview}
              />
            </div>
          )}

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
            <>
              <ReviewHead at={reviewAt} total={total} />
              <MoveList
                moves={game.state.moves}
                currentAt={reviewAt}
                variant="panel"
                onPick={game.gotoMove}
              />
              <ReviewBar
                at={reviewAt}
                total={total}
                variant="panel"
                onGoto={game.gotoMove}
                onRecenter={board.recenter}
                onExit={game.exitReview}
              />
            </>
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
