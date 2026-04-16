import { cn } from '@/lib/utils';

const colorMap = {
  green: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
  emerald: 'bg-green-500/10 text-green-500 dark:text-green-400',
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
};

export default function StatCard({ icon: Icon, label, value, color = 'green' }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 card-hover">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold font-playfair">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-inter">{label}</p>
    </div>
  );
}