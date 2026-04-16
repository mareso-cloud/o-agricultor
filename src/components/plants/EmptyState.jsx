import { Sprout, Plus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyState({ onNewPlant }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {/* Decorative rings */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full border border-primary/10 scale-150 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-primary/5 scale-[2]" />
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-green animate-pulse-glow">
          <Sprout className="w-12 h-12 text-primary animate-float" />
        </div>
      </div>

      <h2 className="font-syne font-bold text-2xl text-foreground mb-2">
        Nenhuma planta cadastrada
      </h2>
      <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
        Comece seu diário de cultivo adicionando sua primeira planta. Monitore cada fase do crescimento.
      </p>

      <Button
        onClick={onNewPlant}
        className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green-intense transition-all hover:scale-105"
      >
        <Plus className="w-5 h-5 mr-2" />
        Adicionar Primeira Planta
      </Button>

      {/* Tips */}
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm">
        {[
          { icon: '🌱', label: 'Germinação' },
          { icon: '🌿', label: 'Vegetativo' },
          { icon: '🌸', label: 'Floração' },
        ].map((tip) => (
          <div key={tip.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/40 bg-card/50">
            <span className="text-2xl">{tip.icon}</span>
            <span className="text-xs text-muted-foreground">{tip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}