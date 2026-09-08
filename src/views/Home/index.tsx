'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createWorkerEngine } from '@/game/ai/workerEngine';
import { makeRng } from '@/game/ai/rng';
import type { Level, Side } from '@/game/core/types';
import { createLocalGameRepository } from '@/game/storage/localGameRepository';
import type { GameResult } from '@/game/storage/types';
import { useBoardCanvas } from '@/hooks/useBoardCanvas';
import { useGame } from '@/hooks/useGame';
import { usePersistence } from '@/hooks/usePersistence';
import { strings } from '@/lib/strings';
import { BoardStage } from './mains/BoardStage';
import { Controls } from './mains/Controls';
import { Header } from './mains/Header';
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

export function Home() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState<Level>('normal');
  const [first, setFirst] = useState<Side>('human');

  const engine = useMemo(() => createWorkerEngine(makeRng(ENGINE_SEED)), []);
  // Worker phải bị đóng khi component rời đi, nếu không mỗi lần hot-reload để lại
  // một luồng còn sống đang giữ vài chục MB bảng ứng viên.
  useEffect(() => () => engine.dispose(), [engine]);

  // Bản local hôm nay; ngày ghép Ducker ID đổi đúng dòng này (ADR-0006).
  const repository = useMemo(() => createLocalGameRepository(), []);
  const persistence = usePersistence(repository);

  const game = useGame(engine, { first: 'human', level });
  const board = useBoardCanvas({
    moves: game.state.moves,
    status: game.state.status,
    onPlace: game.place,
  });

  const status = game.state.status;

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
   * thể render nhiều lần sau khi kết thúc (đổi kích thước cửa sổ, kéo bàn). Không có
   * cái khoá này thì một ván thắng đếm thành ba, và bảng thống kê sai âm thầm — vẫn
   * là số, chỉ là số sai.
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

  const controlProps = {
    canUndo: game.state.moves.length > 0 && status.kind === 'playing',
    canResign: started && status.kind === 'playing',
    onUndo: () => {
      board.clearPreview();
      game.undoMove();
    },
    onRecenter: board.recenter,
    onResign: game.giveUp,
  };

  return (
    <main className="flex h-dvh flex-col">
      <Header levelLabel={LEVEL_LABEL[level]} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative flex min-h-0 flex-1 flex-col">
          <BoardStage board={board} moves={game.state.moves} />
          {!started && (
            <StartOverlay
              stats={persistence.stats}
              onStart={start}
              onClearAll={persistence.clearAll}
            />
          )}

          <div className="lg:hidden">
            <StatusLine
              state={game.state}
              thinking={game.thinking}
              notice={game.notice}
              variant="bar"
            />
          </div>
        </div>

        <div className="lg:hidden">
          <WinSheet
            status={status}
            moveCount={game.state.moves.length}
            variant="sheet"
            onPlayAgain={playAgain}
          />
          <Controls orientation="row" {...controlProps} />
        </div>

        <aside className="hidden w-80 flex-none flex-col border-l border-edge bg-raised shadow-panel lg:flex">
          <StatusLine
            state={game.state}
            thinking={game.thinking}
            notice={game.notice}
            variant="panel"
          />
          {/* Danh sách nước đi (FR-08) vào chỗ trống này ở mốc 5. */}
          <div className="min-h-0 flex-1" />
          <StatsPanel stats={persistence.stats} level={level} />
          <WinSheet
            status={status}
            moveCount={game.state.moves.length}
            variant="panel"
            onPlayAgain={playAgain}
          />
          <Controls orientation="column" {...controlProps} />
        </aside>
      </div>
    </main>
  );
}
