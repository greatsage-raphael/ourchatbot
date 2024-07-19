// audio-player.d.ts
declare module '@madzadev/audio-player' {
    import React from 'react';
  
    interface Track {
      url: string;
      title: string;
      tags: string[];
    }
  
    interface PlayerProps {
      trackList: Track[];
      includeTags?: boolean;
      includeSearch?: boolean;
      showPlaylist?: boolean;
      sortTracks?: boolean;
      autoPlayNextTrack?: boolean;
      customColorScheme?: {
        tagsBackground?: string;
        tagsText?: string;
        tagsBackgroundHoverActive?: string;
        tagsTextHoverActive?: string;
        searchBackground?: string;
        searchText?: string;
        searchPlaceHolder?: string;
        playerBackground?: string;
        titleColor?: string;
        timeColor?: string;
        progressSlider?: string;
        progressUsed?: string;
        progressLeft?: string;
        bufferLoaded?: string;
        volumeSlider?: string;
        volumeUsed?: string;
        volumeLeft?: string;
        playlistBackground?: string;
        playlistText?: string;
        playlistBackgroundHoverActive?: string;
        playlistTextHoverActive?: string;
      };
    }
  
    const Player: React.FC<PlayerProps>;
  
    export default Player;
  }
  