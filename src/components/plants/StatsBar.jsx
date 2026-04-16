import { Sprout, Leaf, Flower2, Trophy } from 'lucide-react';

const stageIcons = {
  germinacao: { icon: Sprout, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Germinando' },
  vegetativo: { icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Vegetativo' },
  floracao: { icon: Flower2, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Floração' },
  colheita: { icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Colheita' },
};

export default function StatsBar({ plants }) {
  const counts = plants.reduce((acc, p) => {
    acc[p.stage] = (acc[p.stage] || 0) + 1;
    return acc;
  }, {});

  const stats = Object.entries(stageIcons).map(([key, val]) => ({
    ...val,
    stage: key,
    count: counts[key] || 0,
  }));

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map(({ icon: Icon, color, bg, label, count }) => (
        <div key={label} className="rounded-2xl border border-border/50 p-3 gradient-card">
          <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <p className="text-xl font-syne font-bold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}