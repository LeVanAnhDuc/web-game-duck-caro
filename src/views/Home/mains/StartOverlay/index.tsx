'use client';

// libs
import { useState } from 'react';
import { Cpu, Info, Users } from 'lucide-react';
// types
import type { PieceSet } from '@/game/appearance/types';
import {
  HOTSEAT,
  VS_AI,
  type Level,
  type Mode,
  type Rule,
  type Side,
} from '@/game/core/types';
// game
import { totalGames, type StatsByLevel } from '@/game/storage/types';
// components
import { PieceGlyph } from '../../components/PieceGlyph';
// others
import { strings } from '@/lib/strings';

const LEVELS: readonly { readonly id: Level; readonly label: string }[] = [
  { id: 'easy', label: strings.levelEasy },
  { id: 'normal', label: strings.levelNormal },
  { id: 'hard', label: strings.levelHard },
];

const RULES: readonly { readonly id: Rule; readonly label: string; readonly hint: string }[] =
  [
    { id: 'blocked', label: strings.ruleBlocked, hint: strings.ruleBlockedHint },
    { id: 'free', label: strings.ruleFree, hint: strings.ruleFreeHint },
  ];

const segment = (active: boolean) =>
  `flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm ${
    active
      ? 'border-0 bg-ink-strong font-semibold text-paper'
      : 'border border-edge bg-raised text-ink hover:bg-paper'
  }`;

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </p>
  );
}

/** Một dòng tổng cho mức đang chọn — đủ để thấy mình đang đứng đâu, không thành bảng. */
function StatsLine({ stats, level }: { stats: StatsByLevel; level: Level }) {
  const forLevel = stats[level];
  if (totalGames(forLevel) === 0) return null;
  return (
    <p className="mt-4 border-t border-edge pt-3 font-mono text-xs text-ink-muted">
      {forLevel.wins} {strings.statsWinShort} · {forLevel.losses} {strings.statsLossShort} ·{' '}
      {forLevel.resigns} {strings.statsResignShort}
    </p>
  );
}

export function StartOverlay({
  stats,
  defaultLevel,
  defaultRule,
  pieceSet,
  onStart,
}: {
  stats: StatsByLevel;
  /** Mức khó từ cài đặt (FR-16) — người chơi mức Khó không phải chọn lại mỗi ván. */
  defaultLevel: Level;
  /** Luật mặc định từ cài đặt. Luật THẬT của ván nằm trong `GameState` (bất biến 14). */
  defaultRule: Rule;
  pieceSet: PieceSet;
  onStart(options: { first: Side; level: Level; mode: Mode; rule: Rule }): void;
}) {
  const [hotseat, setHotseat] = useState(false);
  const [level, setLevel] = useState<Level>(defaultLevel);
  const [rule, setRule] = useState<Rule>(defaultRule);
  const [first, setFirst] = useState<Side>('one');

  const mode = hotseat ? HOTSEAT : VS_AI;
  const ruleHint = RULES.find((entry) => entry.id === rule)?.hint ?? '';

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-paper/85 p-4">
      <div className="w-full max-w-sm rounded-[10px] border border-edge bg-raised p-6 shadow-panel">
        <p className="mb-4 text-sm leading-6 text-ink-muted">{strings.appTagline}</p>

        {/*
          CHẾ ĐỘ nằm trên cùng, và đó là quyết định về bố cục: nó là mục duy nhất làm
          ẩn/hiện một mục khác (Mức khó). Đặt nó ở dưới thì layout nhảy sau khi người
          chơi đã cuộn qua chỗ đó.
        */}
        <FieldLabel>{strings.labelMode}</FieldLabel>
        <div className="mb-4 flex gap-1.5" role="group" aria-label={strings.labelMode}>
          <button
            type="button"
            aria-pressed={!hotseat}
            onClick={() => setHotseat(false)}
            className={segment(!hotseat)}
          >
            <Cpu size={15} aria-hidden="true" />
            {strings.modeVsAi}
          </button>
          <button
            type="button"
            aria-pressed={hotseat}
            onClick={() => setHotseat(true)}
            className={segment(hotseat)}
          >
            <Users size={15} aria-hidden="true" />
            {strings.modeHotseat}
          </button>
        </div>

        {/* Hai người thì KHÔNG có máy nào để đặt mức — mục này biến mất, không bị làm mờ. */}
        {!hotseat && (
          <>
            <FieldLabel>{strings.labelLevel}</FieldLabel>
            <div
              className="mb-4 flex gap-1.5"
              role="group"
              aria-label={strings.labelLevel}
            >
              {LEVELS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={level === option.id}
                  onClick={() => setLevel(option.id)}
                  className={segment(level === option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        <FieldLabel>{strings.labelRule}</FieldLabel>
        <div className="flex gap-1.5" role="group" aria-label={strings.labelRule}>
          {RULES.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={rule === option.id}
              onClick={() => setRule(option.id)}
              className={segment(rule === option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {/*
          Dòng này KHÔNG phải trang trí: "Caro Việt" và "Tự do" là hai cái tên không
          nói được luật cho người chưa biết, nên nghĩa của lựa chọn phải nằm ngay dưới
          nó và phải đổi theo nó.
        */}
        <p className="mb-4 mt-2 flex gap-1.5 text-xs leading-4 text-ink-muted">
          <Info size={14} aria-hidden="true" className="mt-px flex-none" />
          <span>{ruleHint}</span>
        </p>

        <FieldLabel>{strings.labelFirstMove}</FieldLabel>
        <div
          className="mb-6 flex gap-1.5"
          role="group"
          aria-label={strings.labelFirstMove}
        >
          {(['one', 'two'] as const).map((side) => (
            <button
              key={side}
              type="button"
              aria-pressed={first === side}
              onClick={() => setFirst(side)}
              className={segment(first === side)}
            >
              {/* Tên ghế đọc từ `Mode`, nên "Bạn / Máy" đổi thành "Người 1 / Người 2"
                  mà không có một nhánh `if` nào ở đây (bất biến 15). */}
              {strings.seatName(side, mode)}
              {/* Nút đang chọn có nền `--ink-strong`; glyph phải thừa màu chữ
                  của nút, nếu không quân của ghế một là đen trên đen. */}
              <PieceGlyph
                side={side}
                set={pieceSet}
                size={13}
                inherit={first === side}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onStart({ first, level, mode, rule })}
          className="min-h-11 w-full cursor-pointer rounded-md bg-ink-strong text-sm font-semibold text-paper"
        >
          {strings.start}
        </button>

        {/* Hot-seat không vào thống kê (overview.md §4), nên không hiện dòng nào. */}
        {!hotseat && <StatsLine stats={stats} level={level} />}
      </div>
    </div>
  );
}
