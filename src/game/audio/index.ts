/**
 * Âm thanh của game, tổng hợp bằng WebAudio — ADR-0021.
 *
 * KHÔNG có file âm thanh nào, và đây là ràng buộc cứng chứ không phải thẩm mỹ:
 * `NFR-SEC-07` cấm mọi request mạng sau lần tải đầu, và một `.mp3` là một request.
 * Nhúng base64 cũng bị loại — bốn tiếng ngắn tốn hàng chục kB trong First Load JS,
 * mà `NFR-PERF-08` chỉ còn ~34 kB dư.
 *
 * IM LẶNG LÀ TRẠNG THÁI HỢP LỆ. `journeys.md` §US-01 ghi rõ: trình duyệt chặn âm thanh
 * thì phải im, không được vỡ. Nên module này không bao giờ trả `null` và không bao giờ
 * ném — người gọi không phải viết một cái `if` nào.
 */
export type Sounds = {
  /** Người chơi vừa đánh. */
  place(): void;
  /** Máy vừa đánh. Khác `place` ở CAO ĐỘ, không ở âm lượng. */
  reply(): void;
  win(): void;
  lose(): void;
  setEnabled(on: boolean): void;
  /** `false` nghĩa là sẽ im mãi. Dùng để ẩn nút loa, không để bọc lời gọi. */
  readonly available: boolean;
};

type Ctor = new () => AudioContext;

/** Cao độ (Hz) và độ dài (giây) của từng tiếng. */
const VOICES = {
  place: [{ hz: 880, at: 0, ms: 70 }],
  reply: [{ hz: 440, at: 0, ms: 70 }],
  win: [
    { hz: 660, at: 0, ms: 110 },
    { hz: 880, at: 110, ms: 110 },
    { hz: 1170, at: 220, ms: 180 },
  ],
  lose: [
    { hz: 440, at: 0, ms: 140 },
    { hz: 330, at: 140, ms: 220 },
  ],
} as const;

const PEAK_GAIN = 0.12;

const NOOP: Sounds = {
  place: () => {},
  reply: () => {},
  win: () => {},
  lose: () => {},
  setEnabled: () => {},
  available: false,
};

export function createAudio(ctor?: Ctor): Sounds {
  if (ctor === undefined) return NOOP;

  let context: AudioContext | null = null;
  let failed = false;
  let enabled = true;

  /**
   * `AudioContext` được tạo ở lời gọi ĐẦU TIÊN, không phải ở đây.
   *
   * Trình duyệt chặn context tạo trước cử chỉ người dùng, và context bị chặn nằm ở
   * `suspended` — ở nhiều trình duyệt là vĩnh viễn. Tạo lúc mount nghĩa là im lặng
   * mãi mãi mà không lỗi nào nổ ra, đúng loại sai âm thầm tệ nhất.
   */
  const ensureContext = (): AudioContext | null => {
    if (context !== null || failed) return context;
    try {
      context = new ctor();
    } catch {
      failed = true;
    }
    return context;
  };

  const play = (voice: readonly { hz: number; at: number; ms: number }[]): void => {
    if (!enabled) return;
    const ctx = ensureContext();
    if (ctx === null) return;
    try {
      const now = ctx.currentTime;
      for (const note of voice) {
        const start = now + note.at / 1000;
        const end = start + note.ms / 1000;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = note.hz;
        // Envelope: lên nhanh, tắt mượt. Không có nó, mỗi nốt kết thúc bằng một tiếng
        // "pop" do biên độ nhảy về 0 giữa chu kỳ.
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(PEAK_GAIN, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(end);
      }
    } catch {
      // Một tiếng không phát được không phải lý do để làm vỡ một ván caro.
    }
  };

  return {
    place: () => play(VOICES.place),
    reply: () => play(VOICES.reply),
    win: () => play(VOICES.win),
    lose: () => play(VOICES.lose),
    setEnabled: (on: boolean) => {
      enabled = on;
    },
    get available() {
      return !failed;
    },
  };
}

/** Đọc `AudioContext` của trình duyệt, `undefined` nếu không có. */
export function browserAudioCtor(): Ctor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor };
  return w.AudioContext ?? w.webkitAudioContext;
}
