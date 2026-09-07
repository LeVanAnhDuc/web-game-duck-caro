import type { Level } from '@/game/core/types';
import { totalGames, type LevelStats, type StatsByLevel } from '@/game/storage/types';
import { strings } from '@/lib/strings';

const LEVEL_ORDER: readonly Level[] = ['easy', 'normal', 'hard'];

const LEVEL_LABEL: Readonly<Record<Level, string>> = {
  easy: strings.levelEasy,
  normal: strings.levelNormal,
  hard: strings.levelHard,
};

/** Một dòng mức khó: thắng · thua · bỏ ván, tách riêng theo mức (US-04). */
function StatsRow({
  label,
  stats,
  highlight,
}: {
  label: string;
  stats: LevelStats;
  highlight: boolean;
}) {
  const played = totalGames(stats);
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded px-2 py-1 font-mono text-xs ${
        highlight ? 'bg-paper text-ink' : 'text-ink-muted'
      }`}
    >
      <span className={highlight ? 'font-medium' : ''}>{label}</span>
      {played === 0 ? (
        <span>{strings.statsNoGames}</span>
      ) : (
        <span>
          {stats.wins} {strings.statsWinShort} · {stats.losses} {strings.statsLossShort} ·{' '}
          {stats.resigns} {strings.statsResignShort}
        </span>
      )}
    </div>
  );
}

export function StatsPanel({ stats, level }: { stats: StatsByLevel; level: Level }) {
  return (
    <div className="border-t border-edge px-2 py-3">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {strings.statsTitle}
      </p>
      <div className="flex flex-col gap-0.5">
        {LEVEL_ORDER.map((id) => (
          <StatsRow
            key={id}
            label={LEVEL_LABEL[id]}
            stats={stats[id]}
            highlight={id === level}
          />
        ))}
      </div>
    </div>
  );
}
