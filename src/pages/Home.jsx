import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Plus, TrendingUp, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StagesBadge from '@/components/StagesBadge';
import StatCard from '@/components/StatCard';
import PlantForm from '@/components/plants/PlantForm';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const { data: plants = [], refetch: refetchPlants } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.Log.list('-date', 50),
  });

  const activePlants = plants.filter(p => p.status !== 'perdida' && p.status !== 'colhida');
  const flowering = plants.filter(p => p.stage === 'floração' || p.stage === 'floracao').length;
  const recentLogs = logs.slice(0, 5);
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
            <h1 className="font-syne text-3xl font-bold text-foreground">
              Seu <span className="text-primary">Jardim</span>
            </h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 gap-2 glow-green">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Planta</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Leaf} label="Plantas Ativas" value={activePlants.length} color="green" />
          <StatCard icon={Sprout} label="Em Floração" value={flowering} color="emerald" />
          <StatCard icon={Droplets} label="Regas Hoje" value={logs.filter(l => l.type === 'rega' && l.date === today).length} color="blue" />
          <StatCard icon={TrendingUp} label="Registros" value={logs.length} color="purple" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Plants list */}
          <div>
            <h2 className="font-syne text-lg font-bold text-foreground mb-3">Plantas Ativas</h2>
            {activePlants.length === 0 ? (
              <EmptyState onAdd={() => setShowForm(true)} />
            ) : (
              <div className="space-y-2">
                {activePlants.slice(0, 6).map(plant => (
                  <PlantRow key={plant.id} plant={plant} />
                ))}
                {activePlants.length > 6 && (
                  <p className="text-center text-sm text-primary py-2">
                    +{activePlants.length - 6} plantas
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div>
            <h2 className="font-syne text-lg font-bold text-foreground mb-3">Atividade Recente</h2>
            {recentLogs.length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center text-muted-foreground text-sm">
                Nenhum registro ainda
              </div>
            ) : (
              <div className="space-y-2">
                {recentLogs.map(log => (
                  <LogRow key={log.id} log={log} plants={plants} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <PlantForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            refetchPlants();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function PlantRow({ plant }) {
  const days = plant.start_date
    ? differenceInDays(new Date(), new Date(plant.start_date))
    : null;

  return (
    <Link to={`/plant/${plant.id}`}>
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card card-hover">
        <div className="w-10 h-10 rounded-xl bg-muted border border-border/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">🌿</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{plant.name}</p>
          {plant.strain && <p className="text-xs text-muted-foreground truncate">{plant.strain}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StagesBadge stage={plant.stage} />
          {days !== null && (
            <span className="text-xs text-muted-foreground">Dia {days}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function LogRow({ log, plants }) {
  const plant = plants.find(p => p.id === log.plant_id);
  const typeEmoji = {
    rega: '💧', 'nutrição': '🧪', poda: '✂️', foto: '📷',
    'medição': '📏', 'observação': '📝', treinamento: '🌿',
    'defoliação': '🍃', problema: '⚠️', colheita: '🌾',
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card">
      <div className="w-9 h-9 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-base flex-shrink-0">
        {typeEmoji[log.type] || '📝'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize text-foreground">{log.type}</p>
        <p className="text-xs text-muted-foreground truncate">{plant?.name || 'Planta'}</p>
      </div>
      <span className="text-xs text-muted-foreground">
        {log.date ? format(new Date(log.date), 'dd/MM') : ''}
      </span>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/50 bg-card p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Leaf className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-syne text-base font-bold mb-2">Nenhuma planta cadastrada</h3>
      <p className="text-sm text-muted-foreground mb-5">Comece adicionando sua primeira planta</p>
      <Button onClick={onAdd} className="bg-primary gap-2 glow-green">
        <Plus className="w-4 h-4" /> Nova Planta
      </Button>
    </div>
  );
}