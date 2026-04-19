export const LEAF_COLORS = ['#E8D44D', '#6DBE45', '#E8404A', '#40C4E8'];

const BG_COLORS = [
  'rgba(232,212,77,0.15)',
  'rgba(109,190,69,0.15)',
  'rgba(232,64,74,0.15)',
  'rgba(64,196,232,0.15)',
];

// Filtros CSS para recolorir a folha verde original para cada cor
const COLOR_FILTERS = [
  'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.3)',   // amarelo
  'sepia(1) saturate(3) hue-rotate(80deg) brightness(0.9)',  // verde
  'sepia(1) saturate(5) hue-rotate(300deg) brightness(1.1)', // vermelho
  'sepia(1) saturate(4) hue-rotate(160deg) brightness(1.2)', // azul
];

const LEAF_URL = 'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/76f3b0648_Gemini_Generated_Image_wm4o5jwm4o5jwm4o.png';

export default function CannabisLeaf({ className = "w-10 h-10", colorIndex = 0 }) {
  const bg = BG_COLORS[colorIndex % BG_COLORS.length];
  const filter = COLOR_FILTERS[colorIndex % COLOR_FILTERS.length];

  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ background: bg }}
    >
      <img
        src={LEAF_URL}
        alt="cannabis leaf"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter,
        }}
      />
    </div>
  );
}