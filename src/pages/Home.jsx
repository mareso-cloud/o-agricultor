import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Plus, ClipboardList, Trash2, FlaskConical, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StagesBadge from '@/components/StagesBadge';
import PlantForm from '@/components/plants/PlantForm';
import CurePlants from '@/components/plants/CurePlants';
import WateringsModal from '@/components/plants/WateringsModal';
import RemindersTab from '@/components/plants/RemindersTab';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('plantas');
  const queryClient = useQueryClient();

  const { data: plants = [] } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const deletePlant = async (id) => {
    if (!confirm('Apagar esta planta definitivamente?')) return;
    await base44.entities.Plant.delete(id);
    queryClient.invalidateQueries({ queryKey: ['plants'] });
  };

  const { data: logs = [] } = useQuery({
    queryKey: ['logs'],
    queryFn: () => base44.entities.Log.list('-date', 50),
  });

  const activePlants = plants.filter(p => p.status !== 'perdida' && p.status !== 'colhida' && p.status !== 'cura');
  const curePlants = plants.filter(p => p.status === 'cura');
  const recentLogs = logs.slice(0, 5);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [showCure, setShowCure] = useState(false);
  const [showWaterings, setShowWaterings] = useState(false);

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
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setShowWaterings(true)} className="w-full text-left">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 h-full flex flex-col justify-between card-hover">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-300">{logs.filter(l => l.type === 'rega' && l.date === today).length}</p>
              <p className="text-xs text-blue-400/80 mt-1">Regas Hoje</p>
            </div>
          </button>
          <button onClick={() => setShowCure(true)} className="w-full text-left">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 h-full flex flex-col justify-between card-hover">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-purple-300">{curePlants.length}</p>
              <p className="text-xs text-purple-400/80 mt-1">Plantas na Cura</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('plantas')}
            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-all border ${tab === 'plantas' ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
            <Leaf className="w-3.5 h-3.5" /> Plantas Ativas
          </button>
          <button onClick={() => setTab('registros')}
            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-all border ${tab === 'registros' ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
            <ClipboardList className="w-3.5 h-3.5" /> Registros
          </button>
          <button onClick={() => setTab('lembretes')}
            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-all border ${tab === 'lembretes' ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
            <Bell className="w-3.5 h-3.5" /> Lembretes
          </button>
        </div>

        {tab === 'plantas' && (
          activePlants.length === 0 ? (
            <EmptyState onAdd={() => setShowForm(true)} />
          ) : (
            <div className="space-y-2">
              {activePlants.map(plant => (
                <PlantRow key={plant.id} plant={plant} onDelete={deletePlant} />
              ))}
            </div>
          )
        )}

        {tab === 'lembretes' && (
          <RemindersTab plants={plants} />
        )}

        {tab === 'registros' && (
          <div>
            <h2 className="font-syne text-lg font-bold text-foreground mb-3">Atividade Recente</h2>
            {recentLogs.length === 0 ? (
              <div className="rounded-2xl border border-border/50 bg-card p-8 text-center text-muted-foreground text-sm">
                Nenhum registro ainda
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(log => (
                  <LogRow key={log.id} log={log} plants={plants} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showWaterings && (
        <WateringsModal logs={logs} plants={plants} onClose={() => setShowWaterings(false)} />
      )}

      {showCure && (
        <CurePlants plants={curePlants} onClose={() => setShowCure(false)} onUpdate={() => queryClient.invalidateQueries({ queryKey: ['plants'] })} />
      )}

      {showForm && (
        <PlantForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ['plants'] });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function PlantRow({ plant, onDelete }) {
  const days = plant.start_date
    ? differenceInDays(new Date(), new Date(plant.start_date))
    : null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card card-hover group">
      <Link to={`/plant/${plant.id}`} className="flex items-center gap-3 flex-1 min-w-0">
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
        <div className="flex flex-col items-end gap-1 mr-2">
          <StagesBadge stage={plant.stage} />
          {days !== null && (
            <span className="text-xs text-muted-foreground">Dia {days}</span>
          )}
        </div>
      </Link>
      <button
        onClick={() => onDelete(plant.id)}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
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