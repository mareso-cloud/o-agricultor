import { useState, useRef, useEffect } from 'react';
import { Pause, Music, SkipForward } from 'lucide-react';

const PLAYLIST = [
  'Jk-d2Wsgh9s',
  'oe2hdbft5-U',
  'g3t6YDnGXAc',
  'ZFn-wxC1XP0',
];

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: PLAYLIST[trackIndex],
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => { readyRef.current = true; },
          onStateChange: (e) => {
            // Auto advance when video ends
            if (e.data === window.YT.PlayerState.ENDED) {
              nextTrack();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        readyRef.current = false;
      }
    };
  }, []);

  const toggle = () => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.playVideo();
      setPlaying(true);
    }
  };

  const nextTrack = () => {
    const next = (trackIndex + 1) % PLAYLIST.length;
    setTrackIndex(next);
    const player = playerRef.current;
    if (player && readyRef.current) {
      player.loadVideoById(PLAYLIST[next]);
      if (playing) player.playVideo();
    }
  };

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="fixed -bottom-[1px] -right-[1px] w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <div ref={containerRef} />
      </div>

      {/* Control buttons */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-center">
        {playing && (
          <button
            onClick={nextTrack}
            title="Próxima faixa"
            className="w-9 h-9 rounded-full border bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center shadow transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={toggle}
          title={playing ? 'Pausar música' : 'Tocar música'}
          className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all
            ${playing
              ? 'bg-primary border-primary/60 text-primary-foreground glow-green animate-pulse-glow'
              : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
            }`}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
}