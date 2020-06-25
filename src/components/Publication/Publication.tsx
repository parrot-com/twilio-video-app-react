import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import AudioTrack from '../AudioTrack/AudioTrack';

import {
  AudioTrack as IAudioTrack,
  LocalTrackPublication,
  Participant,
  RemoteTrackPublication,
  Track,
} from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocal: boolean;
  disableAudio?: boolean;
  videoPriority?: Track.Priority | null;
}

export default function Publication({
  publication,
  participant,
  isLocal,
  disableAudio,
  videoPriority,
}: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  switch (track.kind) {
    case 'video':
      return null;
    case 'audio':
      // try to find speaker ID in URL and only allow that speaker to be heard
      const match = window.location.href.match(/speaker_id=([^&]+)/);
      if (match && match[1] && match[1] === participant.identity)
        return <AudioTrack userId={participant.identity} track={track as IAudioTrack} />;
      else return null;
    default:
      return null;
  }
}
