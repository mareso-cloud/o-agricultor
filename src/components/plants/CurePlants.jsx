import { X, FlaskConical, Leaf } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';

export default function CurePlants({ plants, onClose, onUpdate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-purple-500/40 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h2 className="font-syne font-bold text-foreground">Plantas na Cura</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {plants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma planta em cura ainda</p>
              <p className="text-xs mt-1">Finalize um cultivo na aba Config da planta</p>
            </div>
          ) : (
            plants.map(plant => <CurePlantCard key={plant.id} plant={plant} onClose={onClose} />)
          )}
        </div>
      </div>
    </div>
  );
}

function CurePlantCard({ plant, onClose }) {
  const harvestDays = plant.harvest_date
    ? differenceInDays(new Date(), new Date(plant.harvest_date))
    : null;

  // Parse notes to extract cure info
  const notes = plant.notes || '';
  const lines = notes.split('\n');

  const getLine = (prefix) => {
    const line = lines.find(l => l.startsWith(prefix));
    return line ? line.replace(prefix, '').trim() : null;
  };

  const rendimento = getLine('Rendimento real:');
  const secagem = getLine('Secagem:');
  const cura = getLine('Cura:');
  const local = getLine('Local:');

  return (
    <Link to={`/plant/${plant.id}`} onClick={onClose}
      className="block rounded-2xl border border-purple-500/25 bg-purple-500/8 p-4 hover:border-purple-500/50 transition-all card-hover">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {plant.photo_url
            ? <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
            : <Leaf className="w-5 h-5 text-purple-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{plant.name}</p>
          {plant.strain && <p className="text-xs text-muted-foreground">{plant.strain}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {harvestDays !== null && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                🌾 Colhida há {harvestDays} dias
              </span>
            )}
            {plant.actual_yield && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                ⚖️ {plant.actual_yield}g
              </span>
            )}
          </div>
          {secagem && <p className="text-xs text-muted-foreground mt-1">🌬️ Secagem: {secagem}</p>}
          {cura && <p className="text-xs text-muted-foreground">🫙 Cura: {cura}</p>}
          {local && local !== '—' && <p className="text-xs text-muted-foreground">📍 {local}</p>}
        </div>
      </div>
    </Link>
  );
}