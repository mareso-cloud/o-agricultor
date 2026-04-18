import { useState, useRef, useEffect } from 'react';
import { Pause, Music } from 'lucide-react';

const PLAYLIST = [
  'Jk-d2Wsgh9s',
  'oe2hdbft5-U',
  'g3t6YDnGXAc',
  'ZFn-wxC1XP0',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);
  const queueRef = useRef(shuffle(PLAYLIST));
  const indexRef = useRef(0);

  const loadNext = () => {
    indexRef.current = (indexRef.current + 1) % queueRef.current.length;
    // Re-shuffle when we've gone through all tracks
    if (indexRef.current === 0) {
      queueRef.current = shuffle(PLAYLIST);
    }
    const player = playerRef.current;
    if (player && readyRef.current) {
      player.loadVideoById(queueRef.current[indexRef.current]);
    }
  };

  useEffect(() => {
    const initPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: queueRef.current[0],
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            readyRef.current = true;
            e.target.playVideo();
            setPlaying(true);
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              loadNext();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT.Player) {
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

  return (
    <>
      {/* Hidden YouTube player */}
      <div className="fixed -bottom-[1px] -right-[1px] w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <div ref={containerRef} />
      </div>

      {/* Single mute/play button */}
      <button
        onClick={toggle}
        title={playing ? 'Silenciar música' : 'Tocar música'}
        className={`fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all
          ${playing
            ? 'bg-primary border-primary/60 text-primary-foreground glow-green animate-pulse-glow'
            : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
          }`}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>
    </>
  );
}