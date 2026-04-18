import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

// Cole aqui a URL do seu MP3 após fazer upload
const MUSIC_URL = 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.4;
    audio.addEventListener('canplaythrough', () => setReady(true));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={playing ? 'Pausar música' : 'Tocar música'}
      className={`fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full border flex items-center justify-center shadow-lg transition-all
        ${playing
          ? 'bg-primary border-primary/60 text-primary-foreground glow-green animate-pulse-glow'
          : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
        }`}
    >
      {playing ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
    </button>
  );
}