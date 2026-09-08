import { describe, expect, it, vi } from 'vitest';
import { createAudio } from './index';

type Osc = { type: string; frequency: { value: number }; started: number[]; stopped: number[] };

/** `AudioContext` giả, ghi lại mọi thứ được tạo. happy-dom không có WebAudio. */
function fakeCtx() {
  const oscillators: Osc[] = [];
  let constructed = 0;

  class Fake {
    currentTime = 0;
    destination = {};
    constructor() {
      constructed += 1;
    }
    createOscillator() {
      const osc: Osc = {
        type: '',
        frequency: { value: 0 },
        started: [],
        stopped: [],
      };
      oscillators.push(osc);
      return {
        ...osc,
        set type(v: string) {
          osc.type = v;
        },
        get type() {
          return osc.type;
        },
        frequency: osc.frequency,
        connect: () => {},
        start: (t: number) => osc.started.push(t),
        stop: (t: number) => osc.stopped.push(t),
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
        },
        connect: () => {},
      };
    }
  }

  return { Fake: Fake as unknown as new () => AudioContext, oscillators, count: () => constructed };
}

describe('createAudio — im lặng là trạng thái hợp lệ (ADR-0021)', () => {
  it('không có AudioContext thì available là false và bốn tiếng đều KHÔNG ném', () => {
    const audio = createAudio(undefined);
    expect(audio.available).toBe(false);
    expect(() => {
      audio.place();
      audio.reply();
      audio.win();
      audio.lose();
      audio.setEnabled(false);
    }).not.toThrow();
  });

  it('ctor ném lỗi thì không ném ra ngoài, và available thành false', () => {
    const Boom = class {
      constructor() {
        throw new Error('bi chan');
      }
    } as unknown as new () => AudioContext;
    const audio = createAudio(Boom);
    expect(() => audio.place()).not.toThrow();
    expect(audio.available).toBe(false);
  });
});

describe('createAudio — phát tiếng', () => {
  it('AudioContext chỉ được tạo ở lời gọi ĐẦU TIÊN, không phải lúc createAudio', () => {
    const { Fake, count } = fakeCtx();
    const audio = createAudio(Fake);
    expect(count()).toBe(0);
    audio.place();
    expect(count()).toBe(1);
    audio.reply();
    expect(count()).toBe(1);
  });

  it('place tạo một oscillator, có start và có stop', () => {
    const { Fake, oscillators } = fakeCtx();
    createAudio(Fake).place();
    expect(oscillators).toHaveLength(1);
    expect(oscillators[0]?.started).toHaveLength(1);
    expect(oscillators[0]?.stopped).toHaveLength(1);
  });

  it('tiếng của máy khác tiếng của người ở CAO ĐỘ', () => {
    const a = fakeCtx();
    createAudio(a.Fake).place();
    const b = fakeCtx();
    createAudio(b.Fake).reply();
    expect(a.oscillators[0]?.frequency.value).not.toBe(b.oscillators[0]?.frequency.value);
  });

  it('thắng và thua là chuỗi nhiều nốt, không phải một tiếng', () => {
    const w = fakeCtx();
    createAudio(w.Fake).win();
    expect(w.oscillators.length).toBeGreaterThan(1);

    const l = fakeCtx();
    createAudio(l.Fake).lose();
    expect(l.oscillators.length).toBeGreaterThan(1);
  });

  it('tắt âm thì không oscillator nào được tạo nữa', () => {
    const { Fake, oscillators } = fakeCtx();
    const audio = createAudio(Fake);
    audio.place();
    expect(oscillators).toHaveLength(1);
    audio.setEnabled(false);
    audio.place();
    audio.win();
    expect(oscillators).toHaveLength(1);
    audio.setEnabled(true);
    audio.place();
    expect(oscillators).toHaveLength(2);
  });

  it('một node ném lỗi giữa lúc phát cũng không làm vỡ ván', () => {
    const Bad = class {
      currentTime = 0;
      destination = {};
      createOscillator() {
        throw new Error('het node');
      }
      createGain() {
        return {};
      }
    } as unknown as new () => AudioContext;
    const audio = createAudio(Bad);
    expect(() => audio.place()).not.toThrow();
  });
});

describe('createAudio — vệ sinh', () => {
  it('không gọi bất kỳ API mạng nào', () => {
    // NFR-SEC-07: module này tồn tại chính vì không được tải file nào.
    const real = globalThis.fetch;
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;
    try {
      const { Fake } = fakeCtx();
      const audio = createAudio(Fake);
      audio.place();
      audio.win();
      expect(spy).not.toHaveBeenCalled();
    } finally {
      globalThis.fetch = real;
    }
  });
});
