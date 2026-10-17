'use client';

// libs
import { useEffect, useMemo, useRef } from 'react';
// types
import type { GameStatus, Mode, Move } from '@/game/core/types';
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
  mode,
}: {
  enabled: boolean;
  started: boolean;
  moves: readonly Move[];
  status: GameStatus;
  /** Bất biến 15: "thắng" hay "thua" là câu hỏi về NGƯỜI, không về tên ghế. */
  mode: Mode;
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

    /*
     * Tiếng thắng/thua chỉ có nghĩa khi có MỘT người và một máy. Ở hot-seat cả hai
     * ghế đều là người, nên "thua" là câu sai với một trong hai người đang ngồi đó —
     * bản trước phát tiếng thất bại khi Người 2 thắng. Ở đó dùng tiếng thắng cho cả
     * hai: ai thắng thì cũng là một người thắng.
     */
    if (status.kind === 'won') {
      if (mode[status.by] === 'human') audio.win();
      else audio.lose();
      return;
    }
    /*
     * `reply()` là tiếng "máy vừa trả lời". Ở hot-seat không có máy nào trả lời, nên
     * cả hai ghế dùng `place()` — hai người chuyền tay nhau thì mỗi nước là một nước
     * đặt quân, không phải một lượt đáp.
     */
    const last = moves[count - 1];
    if (last === undefined) return;
    if (mode[last.side] === 'engine') audio.reply();
    else audio.place();
    // `audio` ổn định qua `useMemo`; ba giá trị kia mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves, status, started, mode]);

  return null;
}
