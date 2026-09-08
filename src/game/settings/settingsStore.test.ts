import { describe, expect, it, vi } from 'vitest';
import { createSettingsStore, DEFAULT_SETTINGS } from './settingsStore';
import { settingsKey } from '@/game/storage/keys';
import type { SafeStorage } from '@/game/storage/safeStorage';

function memory(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  const storage: SafeStorage = {
    read: (k) => data.get(k) ?? null,
    write: (k, v) => {
      data.set(k, v);
      return true;
    },
    remove: (k) => {
      data.delete(k);
    },
    keysWithPrefix: (p) => [...data.keys()].filter((k) => k.startsWith(p)),
  };
  return { storage, data };
}

describe('settingsKey (ADR-0019)', () => {
  it('không mang tiền tố chủ sở hữu — đó là điều làm nó thuộc về máy', () => {
    expect(settingsKey()).toBe('gomoku:v1:settings');
    expect(settingsKey()).not.toContain('local');
  });
});

describe('createSettingsStore', () => {
  it('chưa có gì thì trả về mặc định', () => {
    const { storage } = memory();
    expect(createSettingsStore(storage).load()).toEqual(DEFAULT_SETTINGS);
  });

  it('ghi rồi đọc lại ra nguyên giá trị', () => {
    const { storage } = memory();
    const store = createSettingsStore(storage);
    expect(store.save({ sound: false, defaultLevel: 'hard' })).toBe(true);
    expect(store.load()).toEqual({ sound: false, defaultLevel: 'hard' });
  });

  it('JSON hỏng thì về mặc định, KHÔNG ném (NFR-REL-04)', () => {
    const { storage } = memory({ [settingsKey()]: '{ khong phai json' });
    const store = createSettingsStore(storage);
    expect(() => store.load()).not.toThrow();
    expect(store.load()).toEqual(DEFAULT_SETTINGS);
  });

  it('mức khó lạ thì về mặc định, không đi tiếp vào game', () => {
    // Một mức lạ đi tiếp vào `useGame` sẽ thành khoá tra bảng không tồn tại, và AI
    // chạy với cấu hình `undefined` — vẫn đánh, chỉ là đánh sai.
    const { storage } = memory({
      [settingsKey()]: JSON.stringify({ sound: true, defaultLevel: 'impossible' }),
    });
    expect(createSettingsStore(storage).load()).toEqual(DEFAULT_SETTINGS);
  });

  it('thiếu trường, hoặc trường sai kiểu, đều về mặc định', () => {
    for (const bad of [
      '{}',
      'null',
      '42',
      '"chuoi"',
      JSON.stringify({ sound: 'co' }),
      JSON.stringify({ defaultLevel: 'hard' }),
      JSON.stringify({ sound: 1, defaultLevel: 'hard' }),
    ]) {
      const { storage } = memory({ [settingsKey()]: bad });
      expect(createSettingsStore(storage).load()).toEqual(DEFAULT_SETTINGS);
    }
  });

  it('storage không ghi được thì save trả false và KHÔNG ném', () => {
    const blocked: SafeStorage = {
      read: () => null,
      write: () => false,
      remove: () => {},
      keysWithPrefix: () => [],
    };
    const store = createSettingsStore(blocked);
    expect(() => store.save(DEFAULT_SETTINGS)).not.toThrow();
    expect(store.save(DEFAULT_SETTINGS)).toBe(false);
    expect(store.load()).toEqual(DEFAULT_SETTINGS);
  });

  it('chỉ chạm đúng một khoá, không rải rác thêm khoá nào', () => {
    const { storage, data } = memory();
    createSettingsStore(storage).save({ sound: false, defaultLevel: 'easy' });
    expect([...data.keys()]).toEqual([settingsKey()]);
  });

  it('không gọi localStorage trực tiếp — mọi thứ đi qua seam (bất biến 5)', () => {
    const { storage } = memory();
    const spy = vi.spyOn(window.localStorage, 'getItem');
    createSettingsStore(storage).load();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
