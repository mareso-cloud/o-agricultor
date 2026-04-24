import { useState, useEffect } from 'react';
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

let _player = null;
let _ready = false;
let _queue = shuffle(PLAYLIST);
let _index = 0;
let _isPlaying = false;
let _initialized = false;
let _listeners = new Set();

function notify() {
  _listeners.forEach(fn => fn(_isPlaying));
}

function createPlayer() {
  if (_player) return;

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
  const inner = document.createElement('div');
  container.appendChild(inner);
  document.body.appendChild(container);

  _player = new window.YT.Player(inner, {
    videoId: _queue[_index],
    playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0 },
    events: {
      onReady: (e) => {
        _ready = true;
        e.target.setVolume(50);
        // Não toca automaticamente — aguarda o usuário clicar
      },
      onStateChange: (e) => {
        if (e.data === window.YT.PlayerState.ENDED && _isPlaying) {
          _index = (_index + 1) % _queue.length;
          if (_index === 0) _queue = shuffle(PLAYLIST);
          _player.loadVideoById(_queue[_index]);
        }
      },
    },
  });
}

function loadYTApi(callback) {
  if (window.YT && window.YT.Player) {
    callback();
  } else {
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      callback();
    };
  }
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handler = (state) => setPlaying(state);
    _listeners.add(handler);
    return () => _listeners.delete(handler);
  }, []);

  const toggle = () => {
    if (_isPlaying) {
      // Pausar
      if (_player && _ready) {
        _player.pauseVideo();
      }
      _isPlaying = false;
      notify();
      return;
    }

    // Iniciar — cria o player na primeira vez
    if (!_initialized) {
      _initialized = true;
      loadYTApi(() => {
        createPlayer();
        // Aguarda o player ficar pronto via onReady, então toca
        const waitReady = setInterval(() => {
          if (_ready && _player) {
            clearInterval(waitReady);
            _player.setVolume(50);
            _player.playVideo();
            _isPlaying = true;
            notify();
          }
        }, 200);
      });
    } else if (_player && _ready) {
      _player.setVolume(50);
      _player.playVideo();
      _isPlaying = true;
      notify();
    }
  };

  return (
    <button
      onClick={toggle}
      title={playing ? 'Pausar música' : 'Tocar música'}
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      className={`fixed right-5 z-50 w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all
        ${playing
          ? 'bg-primary border-primary/60 text-primary-foreground glow-green animate-pulse-glow'
          : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
        }`}
    >
      {playing ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
    </button>
  );
}