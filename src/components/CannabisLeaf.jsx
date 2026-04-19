const LEAF_COLORS = ['#E8D44D', '#6DBE45', '#E8404A', '#40C4E8'];

export default function CannabisLeaf({ className = "w-6 h-6", colorIndex = 0 }) {
  const color = LEAF_COLORS[colorIndex % LEAF_COLORS.length];

  return (
    <svg
      viewBox="0 0 100 110"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      {/* Cannabis leaf silhouette */}
      <path d="
        M50 105 C50 105 48 90 48 80
        C40 82 30 80 24 74 C30 72 38 74 44 70
        C34 68 20 62 14 52 C22 52 32 58 40 58
        C28 52 16 40 16 28 C24 34 32 44 40 48
        C36 38 32 24 36 12 C40 22 42 34 46 42
        C44 30 44 16 50 6
        C56 16 56 30 54 42
        C58 34 60 22 64 12
        C68 24 64 38 60 48
        C68 44 76 34 84 28
        C84 40 72 52 60 58
        C68 58 78 52 86 52
        C80 62 66 68 56 70
        C62 74 70 72 76 74
        C70 80 60 82 52 80
        C52 90 50 105 50 105 Z
      " />
      {/* Stem */}
      <line x1="50" y1="80" x2="50" y2="105" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export { LEAF_COLORS };