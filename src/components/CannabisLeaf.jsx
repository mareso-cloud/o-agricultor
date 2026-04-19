export const LEAF_COLORS = ['#E8D44D', '#6DBE45', '#E8404A', '#40C4E8'];
const BG_COLORS = ['rgba(232,212,77,0.15)', 'rgba(109,190,69,0.15)', 'rgba(232,64,74,0.15)', 'rgba(64,196,232,0.15)'];

// SVG path preciso de folha de cannabis com 7 folíolos serrilhados
export default function CannabisLeaf({ className = "w-6 h-6", colorIndex = 0 }) {
  const color = LEAF_COLORS[colorIndex % LEAF_COLORS.length];
  const bg = BG_COLORS[colorIndex % BG_COLORS.length];

  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center flex-shrink-0`}
      style={{ background: bg }}
    >
      <svg viewBox="0 0 100 110" style={{ width: '70%', height: '70%' }} xmlns="http://www.w3.org/2000/svg">
        {/* Folha de cannabis — 7 folíolos */}
        <g fill={color}>
          {/* Folíolo central (topo) */}
          <ellipse cx="50" cy="22" rx="7" ry="18" transform="rotate(0,50,22)" />
          {/* Folíolo superior-esquerdo */}
          <ellipse cx="50" cy="22" rx="6" ry="16" transform="rotate(-30,50,40)" />
          {/* Folíolo superior-direito */}
          <ellipse cx="50" cy="22" rx="6" ry="16" transform="rotate(30,50,40)" />
          {/* Folíolo meio-esquerdo */}
          <ellipse cx="50" cy="22" rx="5" ry="14" transform="rotate(-60,50,48)" />
          {/* Folíolo meio-direito */}
          <ellipse cx="50" cy="22" rx="5" ry="14" transform="rotate(60,50,48)" />
          {/* Folíolo baixo-esquerdo */}
          <ellipse cx="50" cy="22" rx="4" ry="12" transform="rotate(-90,50,55)" />
          {/* Folíolo baixo-direito */}
          <ellipse cx="50" cy="22" rx="4" ry="12" transform="rotate(90,50,55)" />
          {/* Caule */}
          <rect x="48" y="55" width="4" height="22" rx="2" />
        </g>
      </svg>
    </div>
  );
}