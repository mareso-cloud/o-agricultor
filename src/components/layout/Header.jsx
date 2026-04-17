import { Leaf, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header({ onNewPlant }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-green">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-syne font-700 text-base text-foreground leading-none">O AGRICULTOR
</h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">Cultivo Indoor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all">
            <Bell className="lucide lucide-bell w-4 h-4 hidden" />
          </button>
          <Button onClick={onNewPlant} className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow py-2 h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-xl glow-green transition-all hover:scale-105 hidden">

            
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Planta
          </Button>
        </div>
      </div>
    </header>);

}