import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Plus, ClipboardList, Trash2, FlaskConical, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StagesBadge from '@/components/StagesBadge';
import PlantForm from '@/components/plants/PlantForm';
import CurePlants from '@/components/plants/CurePlants';
import WateringsModal from '@/components/plants/WateringsModal';
import RemindersTab from '@/components/plants/RemindersTab';
import PullToRefresh from '@/components/PullToRefresh';
import EtLogo from '@/components/EtLogo';
import SettingsModal from '@/components/SettingsModal';
import CannabisLeaf from '@/components/CannabisLeaf';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('plantas');
  const queryClient = useQueryClient();

  const { data: plants = [] } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

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
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <PullToRefresh onRefresh={handleRefresh}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="mb-6">
          {/* Top row: data (esquerda) | ET centralizado | espaço (direita) */}
          <div className="relative flex items-center justify-center mb-3 min-h-[72px]">
            <p className="absolute left-0 top-0 text-primary text-base font-semibold">
              {format(new Date(), "dd/MM/yyyy")}
            </p>
            <EtLogo size={72} />
          </div>
          {/* Bottom row: título | engrenagem | botão + */}
          <div className="flex items-center justify-between">
            <h1 className="font-syne text-3xl font-bold text-foreground">
              Seu <span className="text-primary">Jardim</span>
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSettings(true)}
                className="w-9 h-9 rounded-xl border border-primary/40 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all glow-green">
                <Settings className="w-4 h-4" />
              </button>
              <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 gap-2 glow-green">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setShowWaterings(true)} className="w-full text-left">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 h-full flex flex-col justify-between card-hover">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-300">{logs.filter(l => l.type === 'rega' && l.date === today).length}</p>
              <p className="text-sm text-blue-400/80 mt-1">Regas Hoje</p>
            </div>
          </button>
          <button onClick={() => setShowCure(true)} className="w-full text-left">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 h-full flex flex-col justify-between card-hover">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-300">{curePlants.length}</p>
              <p className="text-sm text-purple-400/80 mt-1">Plantas na Cura</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('plantas')}
            className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-medium transition-all border ${tab === 'plantas' ? 'bg-primary/15 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'}`}>
            <Leaf className="w-5 h-5" /> Plantas Ativas
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
              {activePlants.map((plant, index) => (
                <PlantRow key={plant.id} plant={plant} onDelete={deletePlant} colorIndex={index} />
              ))}
            </div>
          )
        )}

        {tab === 'lembretes' && (
          <RemindersTab plants={plants} />
        )}

        {tab === 'registros' && (
          <div>
            <h2 className="font-syne text-xl font-bold text-foreground mb-3">Atividade Recente</h2>
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
      </PullToRefresh>

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

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Vasos decorativos no rodapé — todas as telas */}
      <div
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{
          zIndex: 0,
          width: '50vw',
          height: '30vw',
          overflow: 'hidden',
          opacity: 0.05,
          left: '16px',
        }}
      >
        <img
          src="https://media.base44.com/images/public/69e1684117e402d8da5bfd05/317f584bc_Capturadetela2026-04-19042426.png"
          alt=""
          style={{
            position: 'absolute',
            /* mostrar quadrante inferior-esquerdo: a imagem tem 4 vasos em linha */
            /* queremos apenas o 1o vaso (esquerda) na metade inferior */
            width: '200%',        /* escala para 2x a largura do container */
            bottom: 0,
            left: 0,
            filter: 'invert(1)',  /* preto → branco */
            objectFit: 'contain',
            objectPosition: 'left bottom',
          }}
        />
      </div>
    </div>
  );
}

function PlantRow({ plant, onDelete, colorIndex = 0 }) {
  const days = plant.start_date
    ? differenceInDays(new Date(), new Date(plant.start_date))
    : null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card card-hover group">
      <Link to={`/plant/${plant.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        {plant.photo_url ? (
          <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden border border-border/40">
            <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <CannabisLeaf size={48} colorIndex={colorIndex} />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-foreground truncate">{plant.name}</p>
          {plant.strain && <p className="text-sm text-muted-foreground truncate">{plant.strain}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 mr-2">
          <StagesBadge stage={plant.stage} />
          {days !== null && (
            <span className="text-sm text-muted-foreground">Dia {days}</span>
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

  const tags = [];
  if (log.ph_in) tags.push({ label: `pH↓ ${log.ph_in}`, color: 'bg-blue-500/15 text-blue-300 border-blue-500/25' });
  if (log.ph_out) tags.push({ label: `pH↑ ${log.ph_out}`, color: 'bg-blue-400/15 text-blue-200 border-blue-400/25' });
  if (log.ec_in) tags.push({ label: `EC↓ ${log.ec_in}`, color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' });
  if (log.ec_out) tags.push({ label: `EC↑ ${log.ec_out}`, color: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/25' });
  if (log.temp_air) tags.push({ label: `🌡 ${log.temp_air}°C`, color: 'bg-orange-500/15 text-orange-300 border-orange-500/25' });
  if (log.humidity) tags.push({ label: `💧 ${log.humidity}%`, color: 'bg-sky-500/15 text-sky-300 border-sky-500/25' });
  if (log.lux) tags.push({ label: `💡 ${log.lux}µmol`, color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25' });
  if (log.height_cm) tags.push({ label: `📏 ${log.height_cm}cm`, color: 'bg-purple-500/15 text-purple-300 border-purple-500/25' });
  if (log.water_ml) tags.push({ label: `💦 ${log.water_ml}ml`, color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25' });

  return (
    <div className="p-4 rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-base flex-shrink-0">
          {typeEmoji[log.type] || '📝'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium capitalize text-foreground">{log.type}</p>
            <span className="text-sm text-muted-foreground ml-2 flex-shrink-0">
              {log.date ? format(new Date(log.date), 'dd/MM') : ''}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{plant?.name || 'Planta'}</p>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-12">
          {tags.map((t, i) => (
            <span key={i} className={`text-sm px-2.5 py-0.5 rounded-full border ${t.color}`}>{t.label}</span>
          ))}
        </div>
      )}
      {log.notes && (
        <p className="text-sm text-muted-foreground mt-1.5 ml-12 line-clamp-2">{log.notes}</p>
      )}
      {log.nutrients_used && (
        <p className="text-sm text-primary/70 mt-1 ml-12 line-clamp-1">🧪 {log.nutrients_used}</p>
      )}
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/50 bg-card p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Leaf className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-syne text-lg font-bold mb-2">Nenhuma planta cadastrada</h3>
      <p className="text-base text-muted-foreground mb-5">Comece adicionando sua primeira planta</p>
      <Button onClick={onAdd} className="bg-primary gap-2 glow-green">
        <Plus className="w-4 h-4" /> Nova Planta
      </Button>
    </div>
  );
}