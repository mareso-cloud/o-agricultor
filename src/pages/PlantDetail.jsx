import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Leaf, Calendar, Droplets, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import StageBadge from '@/components/plants/Stagebadge';
import LogTimeline from '@/components/plants/LogTimeline';
import LogForm from '@/components/plants/LogForm';
import { differenceInDays } from 'date-fns';

const mediumLabel = { solo: '🪴 Solo', coco: '🥥 Coco', hidroponia: '💧 Hidroponia', aeroponia: '🌬️ Aeroponia' };

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 bg-muted overflow-hidden">
        {plant.photo_url ? (
          <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center animate-float">
              <Leaf className="w-10 h-10 text-primary/60" />
            </div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {/* Back button */}
        <button onClick={() => navigate('/')}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative pb-20">
        {/* Plant info card */}
        <div className="rounded-2xl border border-border/60 gradient-card p-5 mb-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="font-syne font-bold text-2xl text-foreground">{plant.name}</h1>
              {plant.strain && <p className="text-muted-foreground text-sm mt-0.5">{plant.strain}</p>}
            </div>
            <StageBadge stage={plant.stage} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/40">
            <div className="text-center">
              <p className="text-2xl font-syne font-bold text-primary">{daysSince}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Dias de vida</p>
            </div>
            <div className="text-center border-x border-border/40">
              <p className="text-2xl font-syne font-bold text-foreground">{logs.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Registros</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-syne font-bold text-foreground">{plant.pot_size ? `${plant.pot_size}L` : '—'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Vaso</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {plant.medium && <span className="text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground">{mediumLabel[plant.medium]}</span>}
            {plant.tent && <span className="text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground">🏕 {plant.tent}</span>}
          </div>

          {plant.notes && (
            <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border/40">
              <p className="text-sm text-muted-foreground leading-relaxed">{plant.notes}</p>
            </div>
          )}
        </div>

        {/* Logs section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-foreground">Registros</h2>
            <Button onClick={() => setShowLogForm(true)} size="sm"
              className="h-8 px-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl text-xs font-medium transition-all">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Novo Registro
            </Button>
          </div>
          <LogTimeline logs={logs} />
        </div>
      </div>

      {showLogForm && (
        <LogForm
          plantId={id}
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