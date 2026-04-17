import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Droplets, BarChart2, Camera, Settings, Activity, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LogTimeline from '@/components/plants/LogTimeline';
import LogForm from '@/components/plants/LogForm';
import PlantGallery from '@/components/plants/PlantGallery';
import PlantCharts from '@/components/plants/PlantCharts';
import PlantConfig from '@/components/plants/PlantConfig';

const stageLabel = {
  germinacao: 'Germinação', germinação: 'Germinação',
  muda: 'Muda', vegetativo: 'Vegetativo',
  floracao: 'Floração', floração: 'Floração',
  colheita: 'Colheita', cura: 'Cura'
};

const stageBg = {
  germinacao: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  germinação: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  muda: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  vegetativo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  floracao: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  floração: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  colheita: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  cura: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logFormType, setLogFormType] = useState('observação');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('logs');
  const [waterAlert, setWaterAlert] = useState(false);
  const [wateringNow, setWateringNow] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.Plant.list().then(list => list.find(p => p.id === id)),
      base44.entities.Log.filter({ plant_id: id }, '-date'),
    ]).then(([p, l]) => {
      setPlant(p);
      setLogs(l);
      setLoading(false);
    });
  }, [id]);

  const daysSince = plant?.start_date ? differenceInDays(new Date(), new Date(plant.start_date)) : 0;
  const weekNum = Math.floor(daysSince / 7) + 1;

  // Floração days
  const floraDays = plant?.flip_date ? differenceInDays(new Date(), new Date(plant.flip_date)) : null;
  const floraWeek = floraDays !== null ? Math.floor(floraDays / 7) + 1 : null;

  // Last watering
  const lastWater = logs.find(l => l.type === 'rega' || l.type === 'nutrição');
  const lastWaterDays = lastWater?.date ? differenceInDays(new Date(), new Date(lastWater.date)) : null;
  const needsWater = lastWaterDays === null || lastWaterDays >= 2;

  // Last measurements
  const lastMeasure = logs.find(l => l.ph_in || l.ph || l.temp_air || l.temp);
  const lastHeight = logs.find(l => l.height_cm);

  const handleQuickWater = async () => {
    setWateringNow(true);
    const log = await base44.entities.Log.create({
      plant_id: id,
      type: 'rega',
      date: new Date().toISOString().split('T')[0],
      notes: 'Rega rápida',
    });
    setLogs(prev => [log, ...prev]);
    setWateringNow(false);
  };

  const openLogForm = (type = 'observação') => {
    setLogFormType(type);
    setShowLogForm(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!plant) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Planta não encontrada</p>
    </div>
  );

  const photoLogs = logs.filter(l => l.photo_url);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border/40 px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button onClick={() => openLogForm('observação')}
          className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all glow-green">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* Plant Header Card */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-start gap-4">
            {/* Thumb */}
            <div className="w-16 h-16 rounded-xl bg-muted border border-border/50 overflow-hidden flex-shrink-0">
              {plant.photo_url ? (
                <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-syne font-bold text-xl text-foreground leading-tight">{plant.name}</h1>
              {plant.strain && <p className="text-sm text-muted-foreground mt-0.5">{plant.strain}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${stageBg[plant.stage] || 'bg-muted text-muted-foreground border-border'}`}>
                  {stageLabel[plant.stage] || plant.stage}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                  Dia {daysSince}
                </span>
                {plant.tent && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-border/50 text-muted-foreground">
                    🏕 {plant.tent}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Water Alert Banner */}
          {needsWater && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25">
              <Bell className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <p className="text-sm text-orange-300 flex-1">
                {lastWaterDays === null ? 'Nenhuma rega registrada ainda' : `Última rega há ${lastWaterDays} dia${lastWaterDays > 1 ? 's' : ''} — hora de regar!`}
              </p>
              <button onClick={handleQuickWater} disabled={wateringNow}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 transition-all font-medium">
                {wateringNow ? '...' : 'Regar agora'}
              </button>
            </div>
          )}

          {/* Quick Water Button (always visible below alert) */}
          {!needsWater && (
            <div className="mt-4 flex gap-2">
              <button onClick={handleQuickWater} disabled={wateringNow}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/25 transition-all">
                <Droplets className="w-4 h-4" />
                {wateringNow ? 'Regando...' : 'Registrar Rega'}
              </button>
            </div>
          )}
        </div>

        {/* Status Grid */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="font-syne font-semibold text-foreground">Status Atual</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatusCard
              icon="📅" label="Semana / Dia Total"
              value={`Semana ${weekNum} / Dia ${daysSince}`}
            />
            <StatusCard
              icon="☀️" label="Fotoperíodo"
              value={plant.light_schedule || '—'}
            />
            <StatusCard
              icon="🌸" label="Semana Flora"
              value={floraWeek ? `Semana ${floraWeek} / Dia ${floraDays}` : '—'}
            />
            <StatusCard
              icon="📏" label="Altura"
              value={lastHeight ? `${lastHeight.height_cm} cm` : '—'}
            />
            <StatusCard
              icon="💧" label="Última Rega"
              value={lastWater ? (lastWaterDays === 0 ? 'Hoje' : lastWaterDays === 1 ? 'Ontem' : `Há ${lastWaterDays} dias`) : 'Nunca'}
              highlight={needsWater ? 'orange' : undefined}
            />
            <StatusCard
              icon="⏰" label="Próxima Rega"
              value={needsWater ? 'Regar hoje!' : `Em ${2 - (lastWaterDays || 0)} dia(s)`}
              highlight={needsWater ? 'orange' : undefined}
            />
            <StatusCard
              icon="🧪" label="pH In / Out"
              value={lastMeasure?.ph_in ? `${lastMeasure.ph_in}${lastMeasure.ph_out ? ` / ${lastMeasure.ph_out}` : ''}` : lastMeasure?.ph ? String(lastMeasure.ph) : '—'}
            />
            <StatusCard
              icon="⚡" label="EC In / Out"
              value={lastMeasure?.ec_in ? `${lastMeasure.ec_in}${lastMeasure.ec_out ? ` / ${lastMeasure.ec_out}` : ''}` : lastMeasure?.ec ? String(lastMeasure.ec) : '—'}
            />
            <StatusCard
              icon="💡" label="PPFD"
              value={lastMeasure?.lux ? `${lastMeasure.lux} µmol` : '—'}
            />
            <StatusCard
              icon="🌡️" label="Temperatura"
              value={lastMeasure?.temp_air ? `${lastMeasure.temp_air}°C` : lastMeasure?.temp ? `${lastMeasure.temp}°C` : '—'}
            />
            <StatusCard
              icon="💨" label="Umidade (UR)"
              value={lastMeasure?.humidity ? `${lastMeasure.humidity}%` : '—'}
            />
            <StatusCard
              icon="🌫️" label="VPD"
              value={lastMeasure?.vpd ? `${lastMeasure.vpd} kPa` : '—'}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="flex border-b border-border/40">
            {[
              { key: 'logs', label: 'Logs', icon: Activity },
              { key: 'fotos', label: 'Fotos', icon: Camera },
              { key: 'graficos', label: 'Gráficos', icon: BarChart2 },
              { key: 'config', label: 'Config', icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all border-b-2 ${tab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'logs' && (
              <LogTimeline logs={logs} />
            )}
            {tab === 'fotos' && (
              <PlantGallery
                logs={photoLogs}
                plant={plant}
                onAddPhoto={() => openLogForm('foto')}
                onDeleteLog={(logId) => setLogs(prev => prev.filter(l => l.id !== logId))}
              />
            )}
            {tab === 'graficos' && (
              <PlantCharts logs={logs} />
            )}
            {tab === 'config' && (
              <PlantConfig plant={plant} onUpdate={setPlant} />
            )}
          </div>
        </div>
      </div>

      {showLogForm && (
        <LogForm
          plantId={id}
          initialType={logFormType}
          onClose={() => setShowLogForm(false)}
          onSave={(log) => {
            setLogs(prev => [log, ...prev]);
            setShowLogForm(false);
          }}
        />
      )}
    </div>
  );
}

function StatusCard({ icon, label, value, highlight }) {
  const highlights = {
    orange: 'border-orange-500/30 bg-orange-500/8',
  };
  return (
    <div className={`rounded-xl border p-3 ${highlight ? highlights[highlight] : 'border-border/40 bg-muted/30'}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-xs text-muted-foreground truncate">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${highlight === 'orange' ? 'text-orange-300' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}