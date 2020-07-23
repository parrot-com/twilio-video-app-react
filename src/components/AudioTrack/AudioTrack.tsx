import { useEffect, useRef, useMemo } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useAudioOutputDevices } from '../MenuBar/DeviceSelector/deviceHooks/deviceHooks';

interface AudioTrackProps {
  userId: string;
  track: IAudioTrack;
}

export default function AudioTrack({ userId, track }: AudioTrackProps) {
  const outputDevices = useAudioOutputDevices();
  const audioEl = useRef<HTMLAudioElement>();

  const sinkId = useMemo(() => outputDevices.find(({ label }) => label.indexOf(userId) >= 0)?.deviceId, [
    outputDevices,
    userId,
  ]);

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    document.body.appendChild(audioEl.current);

    if (sinkId) {
      audioEl.current.setSinkId?.(sinkId)?.then(
        _ => console.log('succesfully attached to ', sinkId),
        e => console.error('Could not attach to the specified sink with error ', e)
      );
    } else {
      console.error('Could not find a fitting device for user');
    }

    return () => track.detach().forEach(el => el.remove());
  }, [track, userId, sinkId]);

  return null;
}
