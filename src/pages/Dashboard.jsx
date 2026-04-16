import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Plus, TrendingUp, Calendar, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StagesBadge from '@/components/StagesBadge';
import StatCard from '@/components/StatCard';

export default function Dashboard() {
  const { data: plants = [] } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.Log.list('-date', 50),
  });

  const activePlants = plants.filter(p => p.is_active !== false);
  const flowering = plants.filter(p => p.stage === 'floração').length;
  const recentLogs = logs.slice(0, 5);

  const stagesCount = activePlants.reduce((acc, p) => {
    acc[p.stage] = (acc[p.stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-inter mb-1">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold">
            Seu <span className="gradient-text">Jardim</span>
          </h1>
        </div>
        <Link to="/plants">
          <Button className="bg-primary hover:bg-primary/90 gap-2 glow-green-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Planta</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Leaf} label="Plantas Ativas" value={activePlants.length} color="green" />
        <StatCard icon={Sprout} label="Em Floração" value={flowering} color="emerald" />
        <StatCard icon={Droplets} label="Regas Hoje" value={logs.filter(l => l.type === 'rega' && l.date === format(new Date(), 'yyyy-MM-dd')).length} color="blue" />
        <StatCard icon={TrendingUp} label="Registros" value={logs.length} color="purple" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Plants list */}
        <div>
          <h2 className="font-playfair text-xl font-semibold mb-4">Plantas Ativas</h2>
          {activePlants.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {activePlants.slice(0, 6).map(plant => (
                <PlantRow key={plant.id} plant={plant} />
              ))}
              {activePlants.length > 6 && (
                <Link to="/plants" className="block text-center text-sm text-primary hover:text-primary/80 py-2">
                  Ver todas ({activePlants.length})
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="font-playfair text-xl font-semibold mb-4">Atividade Recente</h2>
          {recentLogs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground text-sm">
              Nenhum registro ainda
            </div>
          ) : (
            <div className="space-y-3">
              {recentLogs.map(log => (
                <LogRow key={log.id} log={log} plants={plants} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlantRow({ plant }) {
  const days = plant.start_date
    ? differenceInDays(new Date(), new Date(plant.start_date))
    : null;

  return (
    <Link to={`/plants/${plant.id}`}>
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card card-hover">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <Leaf className="w-5 h-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{plant.name}</p>
          {plant.strain && <p className="text-xs text-muted-foreground truncate">{plant.strain}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StagesBadge stage={plant.stage} />
          {days !== null && (
            <span className="text-xs text-muted-foreground">{days}d</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function LogRow({ log, plants }) {
  const plant = plants.find(p => p.id === log.plant_id);
  const typeEmoji = {
    rega: '💧', nutrição: '🧪', poda: '✂️', foto: '📷', medição: '📏', observação: '📝'
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
      <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-lg shrink-0">
        {typeEmoji[log.type] || '📝'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize">{log.type}</p>
        <p className="text-xs text-muted-foreground truncate">{plant?.name || 'Planta'}</p>
      </div>
      <span className="text-xs text-muted-foreground">
        {log.date ? format(new Date(log.date), 'dd/MM') : ''}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-playfair text-lg font-semibold mb-2">Nenhuma planta cadastrada</h3>
      <p className="text-sm text-muted-foreground mb-5">Comece adicionando sua primeira planta</p>
      <Link to="/plants">
        <Button className="bg-primary gap-2 glow-green-sm">
          <Plus className="w-4 h-4" /> Nova Planta
        </Button>
      </Link>
    </div>
  );
}