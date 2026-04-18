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

// Singleton global — sobrevive entre navegações de página
let _player = null;
let _ready = false;
let _queue = shuffle(PLAYLIST);
let _index = 0;
let _isPlaying = false;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(_isPlaying);
  const divRef = useRef(null);

  useEffect(() => {
    // Já existe player global, apenas sincroniza o estado
    if (_player) {
      setPlaying(_isPlaying);
      return;
    }

    const initPlayer = () => {
      if (_player) return;
      _player = new window.YT.Player(divRef.current, {
        videoId: _queue[_index],
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e) => {
            _ready = true;
            e.target.playVideo();
            _isPlaying = true;
            setPlaying(true);
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              _index = (_index + 1) % _queue.length;
              if (_index === 0) _queue = shuffle(PLAYLIST);
              _player.loadVideoById(_queue[_index]);
            }
          },
        },
      });
    };

    if (!window.YT) {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, []);

  const toggle = () => {
    if (!_player || !_ready) return;
    if (playing) {
      _player.pauseVideo();
      _isPlaying = false;
      setPlaying(false);
    } else {
      _player.playVideo();
      _isPlaying = true;
      setPlaying(true);
    }
  };

  return (
    <>
      <div className="fixed -bottom-[1px] -right-[1px] w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <div ref={divRef} />
      </div>
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