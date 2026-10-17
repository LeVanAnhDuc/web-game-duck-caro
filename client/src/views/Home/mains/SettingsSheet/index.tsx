'use client';

// libs
import { useState } from 'react';
import { Monitor, Moon, Sun, X } from 'lucide-react';
// types
import { PIECE_SETS, THEMES, type PieceSet, type Theme } from '@/game/appearance/types';
import type { Level, Rule } from '@/game/core/types';
import type { Settings } from '@/game/settings/settingsStore';
// components
import { PieceGlyph } from '../../components/PieceGlyph';
// others
import { strings } from '@/lib/strings';

const LEVELS: readonly { readonly id: Level; readonly label: string }[] = [
  { id: 'easy', label: strings.levelEasy },
  { id: 'normal', label: strings.levelNormal },
  { id: 'hard', label: strings.levelHard },
];

const RULES: readonly { readonly id: Rule; readonly label: string }[] = [
  { id: 'blocked', label: strings.ruleBlocked },
  { id: 'free', label: strings.ruleFree },
];

const THEME_LABEL: Readonly<Record<Theme, string>> = {
  light: strings.themeLight,
  dark: strings.themeDark,
  system: strings.themeSystem,
};

const THEME_ICON: Readonly<Record<Theme, typeof Sun>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const PIECE_LABEL: Readonly<Record<PieceSet, string>> = {
  pencil: strings.piecePencil,
  solid: strings.pieceSolid,
  geo: strings.pieceGeo,
  duck: strings.pieceDuck,
};

const segment = (active: boolean) =>
  `min-h-11 flex-1 cursor-pointer rounded-md text-sm ${
    active
      ? 'border-0 bg-ink-strong font-semibold text-paper'
      : 'border border-edge bg-raised hover:bg-paper'
  }`;

function FieldLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
    >
      {children}
    </label>
  );
}

/**
 * Màn cài đặt — FR-16.
 *
 * Sáu mục từ mốc 8: âm thanh, giao diện (FR-19), bộ quân (FR-20), mức khó mặc định,
 * luật mặc định (FR-18), xoá dữ liệu. Một thanh trượt âm lượng vẫn bị từ chối — nó
 * cần lưu số, cần nhãn, cần test biên, và giá trị thêm gần bằng không.
 *
 * Hai mục "mặc định" chỉ ĐIỀN SẴN màn bắt đầu. Luật thật của một ván nằm trong
 * `GameState.rule` (bất biến 14) — đổi ở đây không đổi ván đang chơi, và đó là chủ ý.
 *
 * Đây cũng là chỗ DUY NHẤT dạy bàn phím: `Shift` + mũi tên (ADR-0020) là quy ước không
 * ai tự đoán ra, và không có màn hướng dẫn nào khác trong sản phẩm.
 */
export function SettingsSheet({
  settings,
  onChange,
  onClearAll,
  onClose,
}: {
  settings: Settings;
  onChange(next: Settings): void;
  onClearAll(): void;
  onClose(): void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={strings.settingsTitle}
      /*
       * Dưới 1024: sheet neo đáy, `absolute` trong khung bàn.
       * Từ 1024: `fixed` để cắm vào MÉP CỬA SỔ, chồng đúng chỗ của cột phải.
       * Để `absolute` thì `right-0` neo vào mép khung BÀN, và sheet lơ lửng giữa màn —
       * không cắm vào đâu cả, không căn giữa. Thấy được bằng mắt, không bằng test.
       */
      className="absolute inset-x-0 bottom-0 z-20 max-h-[85%] overflow-y-auto rounded-t-[10px] border-t border-edge bg-raised p-6 shadow-sheet lg:fixed lg:inset-y-0 lg:left-auto lg:right-0 lg:w-80 lg:max-h-none lg:rounded-none lg:border-l lg:border-t-0"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="text-xl font-bold leading-7 text-ink-strong">
          {strings.settingsTitle}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={strings.settingsClose}
          className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-md text-ink hover:bg-paper"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Nhãn liên kết bằng `htmlFor`/`id` — NFR-A11Y-04. */}
      <div className="mb-5">
        <FieldLabel htmlFor="setting-sound">{strings.settingsSound}</FieldLabel>
        <label
          htmlFor="setting-sound"
          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-edge bg-paper px-3 text-sm"
        >
          <input
            id="setting-sound"
            type="checkbox"
            checked={settings.sound}
            onChange={(e) => onChange({ ...settings, sound: e.target.checked })}
            className="h-5 w-5 flex-none cursor-pointer accent-[var(--ink-strong)]"
          />
          {settings.sound ? strings.soundOn : strings.soundOff}
        </label>
      </div>

      {/*
        Ba trạng thái, không phải một công tắc. "Theo máy" là mặc định và phải giữ
        được — bỏ nó là ghim người dùng vào một bên ngay lần đầu bấm (ADR-0026).
      */}
      <div className="mb-5">
        <FieldLabel>{strings.settingsTheme}</FieldLabel>
        <div className="flex gap-2" role="group" aria-label={strings.settingsTheme}>
          {THEMES.map((theme) => {
            const Icon = THEME_ICON[theme];
            return (
              <button
                key={theme}
                type="button"
                aria-pressed={settings.theme === theme}
                onClick={() => onChange({ ...settings, theme })}
                className={`${segment(settings.theme === theme)} flex items-center justify-center gap-1.5`}
              >
                <Icon size={15} aria-hidden="true" />
                {THEME_LABEL[theme]}
              </button>
            );
          })}
        </div>
      </div>

      {/*
        Mỗi ô vẽ HÌNH THẬT của bộ đó, không phải tên nó. Bộ quân là một cặp hình
        (ADR-0027), nên một danh sách chữ bắt người chơi đoán mình đang chọn gì —
        và `PieceGlyph` đọc cùng dữ liệu hình với bàn cờ, nên cái thấy ở đây đúng
        là cái sẽ thấy trên bàn.
      */}
      <div className="mb-5">
        <FieldLabel>{strings.settingsPieces}</FieldLabel>
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          role="group"
          aria-label={strings.settingsPieces}
        >
          {PIECE_SETS.map((set) => {
            const on = settings.pieceSet === set;
            return (
              <button
                key={set}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ ...settings, pieceSet: set })}
                /*
                 * Trạng thái CHỌN dùng `--ink-strong`, không dùng `--focus`.
                 * `--focus` là màu của vòng con trỏ bàn phím (MASTER.md §1); lấy nó
                 * làm viền chọn thì người đi bàn phím không còn phân biệt được "ô
                 * này đang được chọn" với "ô này đang có focus". Mockup đã duyệt
                 * vẽ viền `--focus`; chỗ lệch này là cố ý và đã được nói ra.
                 */
                className={`flex min-h-[60px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 transition-colors ${
                  on
                    ? 'border-2 border-ink-strong bg-paper'
                    : 'border border-edge bg-raised hover:bg-paper'
                }`}
              >
                <span className="flex items-center gap-2">
                  <PieceGlyph side="one" set={set} size={22} />
                  <PieceGlyph side="two" set={set} size={22} />
                </span>
                <span className={`text-xs ${on ? 'font-semibold' : 'text-ink-muted'}`}>
                  {PIECE_LABEL[set]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>{strings.settingsDefaultLevel}</FieldLabel>
        <div className="flex gap-2" role="group" aria-label={strings.settingsDefaultLevel}>
          {LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              aria-pressed={settings.defaultLevel === level.id}
              onClick={() => onChange({ ...settings, defaultLevel: level.id })}
              className={segment(settings.defaultLevel === level.id)}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>{strings.settingsDefaultRule}</FieldLabel>
        <div
          className="flex gap-2"
          role="group"
          aria-label={strings.settingsDefaultRule}
        >
          {RULES.map((rule) => (
            <button
              key={rule.id}
              type="button"
              aria-pressed={settings.defaultRule === rule.id}
              onClick={() => onChange({ ...settings, defaultRule: rule.id })}
              className={segment(settings.defaultRule === rule.id)}
            >
              {rule.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 border-t border-edge pt-4">
        <FieldLabel>{strings.keyboardTitle}</FieldLabel>
        <p className="font-mono text-xs leading-5 text-ink-muted">
          {strings.keyboardHelp}
        </p>
      </div>

      {/*
        Xoá dữ liệu HỎI XÁC NHẬN trước, và câu xác nhận nói rõ không có bản sao nào.
        NFR-DATA-03 ghi rằng dữ liệu mất là mất hẳn, và điều đó phải được nói ở UI chứ
        không chỉ trong tài liệu.
      */}
      <div className="border-t border-edge pt-4">
        {confirming ? (
          <>
            <p className="mb-3 text-xs leading-5 text-ink-muted">
              {strings.clearAllWarning}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 flex-1 cursor-pointer rounded-md border border-edge bg-raised text-sm font-semibold hover:bg-paper"
              >
                {strings.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onClearAll();
                }}
                className="min-h-11 flex-1 cursor-pointer rounded-md border border-danger bg-transparent text-sm font-semibold text-danger"
              >
                {strings.clearAllConfirm}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-11 w-full cursor-pointer rounded-md border border-danger bg-transparent text-sm font-semibold text-danger"
          >
            {strings.clearAll}
          </button>
        )}
      </div>
    </div>
  );
}
