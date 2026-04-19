export default function CannabisLeaf({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cannabis leaf SVG shape */}
      <g fill="hsl(158 64% 40%)" opacity="0.85">
        {/* Center stem */}
        <path d="M50 95 Q50 70 50 50" stroke="hsl(158 64% 35%)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Main top leaf */}
        <path d="M50 10 C44 18 35 22 30 30 C38 28 44 32 50 38 C56 32 62 28 70 30 C65 22 56 18 50 10Z"/>
        {/* Left mid leaf */}
        <path d="M50 38 C42 30 28 28 18 32 C22 40 32 42 42 44 C44 46 46 50 50 52Z"/>
        {/* Right mid leaf */}
        <path d="M50 38 C58 30 72 28 82 32 C78 40 68 42 58 44 C56 46 54 50 50 52Z"/>
        {/* Left lower leaf */}
        <path d="M50 52 C38 46 22 48 14 55 C20 62 34 62 46 58 C48 60 50 64 50 66Z"/>
        {/* Right lower leaf */}
        <path d="M50 52 C62 46 78 48 86 55 C80 62 66 62 54 58 C52 60 50 64 50 66Z"/>
        {/* Bottom small left */}
        <path d="M50 66 C42 62 30 64 26 70 C32 74 42 72 48 70 C49 72 50 76 50 78Z"/>
        {/* Bottom small right */}
        <path d="M50 66 C58 62 70 64 74 70 C68 74 58 72 52 70 C51 72 50 76 50 78Z"/>
      </g>
    </svg>
  );
}