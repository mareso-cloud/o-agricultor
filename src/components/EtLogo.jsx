import { motion } from 'framer-motion';

const ET_IMAGE = 'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/906278723_et.png';

// Smoke puff positions relative to the ET image (cigar tip is bottom-left area)
const SMOKE_PUFFS = [
  { delay: 0,    x: '18%', startY: '62%' },
  { delay: 0.5,  x: '12%', startY: '60%' },
  { delay: 1.0,  x: '22%', startY: '64%' },
];

export default function EtLogo({ size = 42 }) {
  return (
    <div style={{ width: size, height: size }} className="relative select-none flex-shrink-0">
      {/* Real ET image */}
      <img
        src={ET_IMAGE}
        alt="O Agricultor Indoor"
        style={{ width: size, height: size }}
        className="object-contain"
      />

      {/* Animated smoke puffs over cigar tip */}
      {SMOKE_PUFFS.map((puff, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.12,
            height: size * 0.12,
            left: puff.x,
            top: puff.startY,
            background: 'radial-gradient(circle, rgba(180,255,180,0.7) 0%, rgba(180,255,180,0) 70%)',
          }}
          animate={{
            y: [0, -(size * 0.5 + i * size * 0.1)],
            x: [0, (i % 2 === 0 ? -1 : 1) * size * 0.08],
            opacity: [0.8, 0],
            scale: [1, 2.5 + i * 0.5],
          }}
          transition={{
            duration: 1.8,
            delay: puff.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}