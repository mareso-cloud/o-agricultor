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

// Global singleton — evita múltiplos players ao navegar entre páginas
let globalPlayer = null;
let globalReady = false;
let globalPlaying = false;
let globalQueue = shuffle(PLAYLIST);
let globalIndex = 0;
let setPlayingGlobal = null;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(globalPlaying);
  const containerRef = useRef(null);

  setPlayingGlobal = setPlaying;

  const loadNext = () => {
    globalIndex = (globalIndex + 1) % globalQueue.length;
    if (globalIndex === 0) globalQueue = shuffle(PLAYLIST);
    if (globalPlayer && globalReady) {
      globalPlayer.loadVideoById(globalQueue[globalIndex]);
    }
  };

  useEffect(() => {
    // Se já existe um player global, não cria outro
    if (globalPlayer) return;

    const initPlayer = () => {
      if (globalPlayer) return; // dupla guarda
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;bottom:-1px;right:-1px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
      const inner = document.createElement('div');
      div.appendChild(inner);
      document.body.appendChild(div);

      globalPlayer = new window.YT.Player(inner, {
        videoId: globalQueue[0],
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e) => {
            globalReady = true;
            e.target.playVideo();
            globalPlaying = true;
            setPlayingGlobal?.(true);
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) loadNext();
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

    // Não destrói no cleanup — player permanece vivo entre navegações
  }, []);

  const toggle = () => {
    if (!globalPlayer || !globalReady) return;
    if (playing) {
      globalPlayer.pauseVideo();
      globalPlaying = false;
      setPlaying(false);
    } else {
      globalPlayer.playVideo();
      globalPlaying = true;
      setPlaying(true);
    }
  };

  return (
    <>
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