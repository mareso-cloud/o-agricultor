const LEAF_COLORS = ['#E8D44D', '#6DBE45', '#E8404A', '#40C4E8'];

// Converte hex para filtro CSS hue-rotate aproximado
const COLOR_FILTERS = [
  'invert(1) sepia(1) saturate(3) hue-rotate(0deg) brightness(1.1)',   // amarelo
  'invert(1) sepia(1) saturate(3) hue-rotate(80deg) brightness(0.9)',  // verde
  'invert(1) sepia(1) saturate(3) hue-rotate(320deg) brightness(1)',   // vermelho
  'invert(1) sepia(1) saturate(3) hue-rotate(170deg) brightness(1.1)', // azul
];

export default function CannabisLeaf({ className = "w-6 h-6", colorIndex = 0 }) {
  const filter = COLOR_FILTERS[colorIndex % COLOR_FILTERS.length];

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <img
        src="https://media.base44.com/images/public/69e1684117e402d8da5bfd05/f3c675d99_Capturadetela2026-04-19045931.png"
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

export { LEAF_COLORS };