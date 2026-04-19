const LEAF_IMAGES = [
  'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/561095cb5_generated_image.png', // amarelo
  'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/a7719f7f8_generated_image.png', // verde
  'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/b9653392d_generated_image.png', // vermelho
  'https://media.base44.com/images/public/69e1684117e402d8da5bfd05/4067cd2b9_generated_image.png', // azul
];

export const LEAF_COLORS = ['#E8D44D', '#6DBE45', '#E8404A', '#40C4E8'];

export default function CannabisLeaf({ className = "w-6 h-6", colorIndex = 0, style = {} }) {
  const src = LEAF_IMAGES[colorIndex % LEAF_IMAGES.length];

  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{
        objectFit: 'contain',
        mixBlendMode: 'screen',
        ...style,
      }}
    />
  );
}