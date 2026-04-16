const stageConfig = {
  'germinação': { label: 'Germinação', color: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400' },
  'muda': { label: 'Muda', color: 'bg-lime-500/15 text-lime-600 dark:text-lime-400' },
  'vegetativo': { label: 'Vegetativo', color: 'bg-green-500/15 text-green-600 dark:text-green-400' },
  'floração': { label: 'Floração', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  'colheita': { label: 'Colheita', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
};

export default function StagesBadge({ stage }) {
  const config = stageConfig[stage] || { label: stage, color: 'bg-muted text-muted-foreground' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}