'use client';

import { useEffect, useState, useRef } from 'react';
import { Video, Participant, Room } from 'twilio-video';
import { Phone, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';

interface VideoRoomProps {
  roomName: string;
  userName: string;
  onLeave?: () => void;
}

export function VideoRoom({ roomName, userName, onLeave }: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLDivElement>(null);
  const participantsRef = useRef<Map<string, Participant>>(new Map());

  useEffect(() => {
    const joinRoom = async () => {
      try {
        setIsLoading(true);
        
        // Obter token de acesso
        const response = await fetch('/api/video-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: userName, room: roomName }),
        });

        if (!response.ok) {
          throw new Error('Failed to get video token');
        }

        const { token } = await response.json();

        // Conectar à sala
        const room = await Video.connect(token, {
          name: roomName,
          audio: { name: 'microphone' },
          video: { name: 'camera' },
          maxAudioBitrate: 16000,
          maxVideoBitrate: 2500000,
        });

        setRoom(room);
        setParticipants(Array.from(room.participants.values()));

        // Listener para novos participantes
        const participantSubscribed = (participant: Participant) => {
          setParticipants((prevParticipants) => [...prevParticipants, participant]);
        };

        const participantUnsubscribed = (participant: Participant) => {
          setParticipants((prevParticipants) =>
            prevParticipants.filter((p) => p !== participant)
          );
        };

        room.on('participantConnected', participantSubscribed);
        room.on('participantDisconnected', participantUnsubscribed);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to join room');
        setIsLoading(false);
      }
    };

    joinRoom();

    return () => {
      setRoom((prevRoom) => {
        if (prevRoom && prevRoom.localParticipant.state === 'connected') {
          prevRoom.localParticipant.tracks.forEach((trackSubscription) => {
            trackSubscription.track.stop();
          });
          prevRoom.disconnect();
          return null;
        }
        return prevRoom;
      });
    };
  }, [roomName, userName]);

  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((trackSubscription) => {
        trackSubscription.track.enable(!isAudioEnabled);
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((trackSubscription) => {
        trackSubscription.track.enable(!isVideoEnabled);
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleLeave = () => {
    if (room) {
      room.localParticipant.tracks.forEach((trackSubscription) => {
        trackSubscription.track.stop();
      });
      room.disconnect();
      setRoom(null);
    }
    onLeave?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Conectando à sala de vídeo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Vídeo Local */}
      <div className="flex-1 relative">
        <div ref={videoRef} className="w-full h-full grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          {room && (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              isLocal={true}
            />
          )}
          {participants.map((participant) => (
            <Participant key={participant.sid} participant={participant} />
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 flex justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${
            isAudioEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isAudioEnabled ? 'Desativar áudio' : 'Ativar áudio'}
        >
          {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            isVideoEnabled
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title={isVideoEnabled ? 'Desativar vídeo' : 'Ativar vídeo'}
        >
          {isVideoEnabled ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>

        <button
          onClick={handleLeave}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          title="Sair da reunião"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}

interface ParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

function Participant({ participant, isLocal }: ParticipantProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoTrack = useRef<any>();
  const audioTrack = useRef<any>();

  const videoSubscription = participant.videoTracks.get(Array.from(participant.videoTracks.keys())[0]);
  const audioSubscription = participant.audioTracks.get(Array.from(participant.audioTracks.keys())[0]);

  useEffect(() => {
    setVideoTrack();
    setAudioTrack();
    const videoSubscription = participant.videoTracks.get(Array.from(participant.videoTracks.keys())[0]);
    const audioSubscription = participant.audioTracks.get(Array.from(participant.audioTracks.keys())[0]);

    return () => {
      setVideoTrack(undefined);
      setAudioTrack(undefined);
    };
  }, [participant.videoTracks, participant.audioTracks]);

  const videoElement = videoSubscription?.track.attach();
  const audioElement = audioSubscription?.track.attach();

  useEffect(() => {
    const videoElement = videoSubscription?.track.attach();
    if (videoElement && videoRef.current) {
      videoRef.current.appendChild(videoElement);
      return () => {
        videoElement.remove();
      };
    }
  }, [videoSubscription]);

  useEffect(() => {
    const audioElement = audioSubscription?.track.attach();
    if (audioElement && audioRef.current) {
      audioRef.current.appendChild(audioElement);
      return () => {
        audioElement.remove();
      };
    }
  }, [audioSubscription]);

  const setVideoTrack = (videoTrack?: any) => {
    if (videoTrack === undefined) {
      videoTrack = videoSubscription?.track;
    }
    videoTrack?.attach(videoRef.current);
    return () => {
      videoTrack?.detach();
    };
  };

  const setAudioTrack = (audioTrack?: any) => {
    if (audioTrack === undefined) {
      audioTrack = audioSubscription?.track;
    }
    audioTrack?.attach(audioRef.current);
    return () => {
      audioTrack?.detach();
    };
  };

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <div ref={videoRef} className="w-full h-full" />
      <audio ref={audioRef} autoPlay={true} muted={isLocal} />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {participant.identity}
      </div>
    </div>
  );
}
