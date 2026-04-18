import { motion } from 'framer-motion';

// Animated ET logo - a stylized "ET" with smoke puffs from a pipe
export default function EtLogo({ size = 36 }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center select-none">
      {/* Smoke puffs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: 6 - i,
            height: 6 - i,
            bottom: size * 0.55,
            left: size * 0.62 + i * 3,
          }}
          animate={{
            y: [0, -(8 + i * 5)],
            opacity: [0.7, 0],
            scale: [1, 1.8 + i * 0.3],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ET face SVG */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Head */}
        <ellipse cx="18" cy="15" rx="11" ry="13" fill="hsl(158 64% 18%)" stroke="hsl(158 64% 40%)" strokeWidth="1.2" />

        {/* Big alien eyes */}
        <ellipse cx="13" cy="13" rx="4" ry="3" fill="hsl(158 64% 40% / 0.3)" stroke="hsl(158 64% 40%)" strokeWidth="0.8" />
        <ellipse cx="23" cy="13" rx="4" ry="3" fill="hsl(158 64% 40% / 0.3)" stroke="hsl(158 64% 40%)" strokeWidth="0.8" />

        {/* Pupils - animated glow */}
        <motion.circle cx="13" cy="13" r="2" fill="hsl(158 64% 60%)"
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="23" cy="13" r="2" fill="hsl(158 64% 60%)"
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />

        {/* Nose */}
        <ellipse cx="18" cy="19" rx="1.5" ry="1" fill="hsl(158 40% 30%)" />

        {/* Smile */}
        <path d="M14 22 Q18 25 22 22" stroke="hsl(158 64% 40%)" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Pipe */}
        <rect x="20" y="23" width="8" height="2.5" rx="1.2" fill="hsl(30 50% 35%)" />
        <circle cx="28.5" cy="24.2" r="2" fill="hsl(30 50% 25%)" stroke="hsl(30 50% 40%)" strokeWidth="0.6" />

        {/* Neck */}
        <rect x="15" y="27" width="6" height="4" rx="1" fill="hsl(158 64% 14%)" />

        {/* Body hint */}
        <ellipse cx="18" cy="33" rx="7" ry="3.5" fill="hsl(158 64% 12%)" stroke="hsl(158 64% 30%)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}