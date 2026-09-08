'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Level } from '@/game/core/types';
import type { Settings } from '@/game/settings/settingsStore';
import { strings } from '@/lib/strings';

const LEVELS: readonly { readonly id: Level; readonly label: string }[] = [
  { id: 'easy', label: strings.levelEasy },
  { id: 'normal', label: strings.levelNormal },
  { id: 'hard', label: strings.levelHard },
];

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
 * Đúng ba mục và không hơn: âm thanh, mức khó mặc định, xoá dữ liệu. Một thanh trượt
 * âm lượng cần lưu số, cần nhãn, cần test biên, và giá trị thêm gần bằng không.
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
      className="absolute inset-x-0 bottom-0 z-10 max-h-[85%] overflow-y-auto rounded-t-[10px] border-t border-edge bg-raised p-6 shadow-sheet lg:inset-y-0 lg:left-auto lg:right-0 lg:w-80 lg:rounded-none lg:border-l lg:border-t-0"
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
