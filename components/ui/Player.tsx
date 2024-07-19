// Player.tsx

import React, { useRef, useState } from 'react';

interface Track {
  id: number;
  userid: string;
  audiourl: string;
  dateadded: string;
  maintopic: string;
  audiolecture: boolean;
  transcription: string;
  transcription_token_count: number;
  embedding: string;
}

interface PlayerProps {
  tracks: Track[];
}

const Player: React.FC<PlayerProps> = ({ tracks }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setIsPlaying(false);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  return (
    <div className="audio-player">
      <h3>{currentTrack.maintopic}</h3>
      <p>{currentTrack.dateadded}</p>
      <audio ref={audioRef} src={currentTrack.audiourl} preload="auto" />
      <div className="controls">
        <button onClick={handlePrevTrack}>Previous</button>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleNextTrack}>Next</button>
      </div>
      <style jsx>{`
        .audio-player {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h3 {
          margin: 0;
          font-size: 1.5em;
        }
        p {
          margin: 5px 0 15px 0;
          color: #666;
        }
        .controls {
          display: flex;
          gap: 10px;
        }
        button {
          background-color: #0070f3;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Player;
