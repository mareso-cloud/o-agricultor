const stages = {
  germinacao: { label: 'Germinação', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
  vegetativo: { label: 'Vegetativo', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  floracao: { label: 'Floração', color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  colheita: { label: 'Colheita', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
};

export default function StageBadge({ stage }) {
  const s = stages[stage] || stages.germinacao;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}`}>
      {s.label}
    </span>
  );
}