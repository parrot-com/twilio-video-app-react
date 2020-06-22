import { useEffect, useRef, useMemo } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';
import { useAppState } from '../../state';
import { useAudioOutputDevices } from '../MenuBar/DeviceSelector/deviceHooks/deviceHooks';

interface AudioTrackProps {
  userId?: string;
  track: IAudioTrack;
}

export default function AudioTrack({ userId, track }: AudioTrackProps) {
  const outputDevices = useAudioOutputDevices();
  const audioEl = useRef<HTMLAudioElement>();

  const sinkId = useMemo(() => outputDevices.find(({ label }) => label === userId)?.id || 'default', [
    outputDevices,
    userId,
  ]);

  useEffect(() => {
    audioEl.current = track.attach();
    audioEl.current.setAttribute('data-cy-audio-track-name', track.name);
    document.body.appendChild(audioEl.current);
    return () => track.detach().forEach((el) => el.remove());
  }, [track]);

  useEffect(() => {
    audioEl.current?.setSinkId?.(sinkId);
  }, [sinkId]);

  return null;
}
