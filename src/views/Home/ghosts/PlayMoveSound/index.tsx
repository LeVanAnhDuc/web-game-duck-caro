'use client';

// libs
import { useEffect, useMemo, useRef } from 'react';
// types
import type { GameStatus, Move } from '@/game/core/types';
// game
import { browserAudioCtor, createAudio } from '@/game/audio';

/**
 * Tiếng của ván: đặt quân, máy trả lời, thắng, thua.
 *
 * Ghost này sở hữu LUÔN đối tượng âm thanh, vì nó là chỗ duy nhất phát tiếng. Nó dựng
 * MỘT lần cho cả phiên, nhưng `AudioContext` bên trong chỉ sinh ra ở tiếng đầu tiên —
 * tức ở một cử chỉ người dùng (ADR-0021). Vì vậy ghost phải được render VÔ ĐIỀU KIỆN:
 * gắn nó sau một `&&` là mỗi lần điều kiện đổi lại dựng một `Sounds` mới.
 *
 * Tiếng đi theo NƯỚC MỚI, không theo `status`: một `useEffect` trên `status` sẽ im
 * suốt ván và chỉ kêu lúc kết thúc. Khoá `soundedFor` theo số nước để resize hay tua
 * lại không phát lại tiếng — cùng loại khoá như khoá chống đếm trùng thống kê.
 */
export function PlayMoveSound({
  enabled,
  started,
  moves,
  status,
}: {
  enabled: boolean;
  started: boolean;
  moves: readonly Move[];
  status: GameStatus;
}) {
  const audio = useMemo(() => createAudio(browserAudioCtor()), []);

  useEffect(() => {
    audio.setEnabled(enabled);
  }, [audio, enabled]);

  const soundedFor = useRef(0);

  useEffect(() => {
    const count = moves.length;
    if (count === soundedFor.current) return;
    const grew = count > soundedFor.current;
    soundedFor.current = count;
    if (!grew || !started) return;

    if (status.kind === 'won') {
      if (status.by === 'one') audio.win();
      else audio.lose();
      return;
    }
    const last = moves[count - 1];
    if (last?.side === 'one') audio.place();
    else if (last?.side === 'two') audio.reply();
    // `audio` ổn định qua `useMemo`; ba giá trị kia mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves, status, started]);

  return null;
}
