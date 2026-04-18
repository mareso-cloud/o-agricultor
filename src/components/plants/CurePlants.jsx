import { useState } from 'react';
import { X, FlaskConical, Leaf, Trash2, ExternalLink } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function CurePlants({ plants, onClose, onUpdate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-purple-500/40 animate-fade-in">
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
            plants.map(plant => (
              <CurePlantCard key={plant.id} plant={plant} onClose={onClose} onDelete={async () => {
                await base44.entities.Plant.delete(plant.id);
                onUpdate();
              }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CurePlantCard({ plant, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const harvestDays = plant.harvest_date
    ? differenceInDays(new Date(), new Date(plant.harvest_date))
    : null;

  const notes = plant.notes || '';
  const lines = notes.split('\n');
  const getLine = (prefix) => {
    const line = lines.find(l => l.startsWith(prefix));
    return line ? line.replace(prefix, '').trim() : null;
  };

  const secagem = getLine('Secagem:');
  const curaInfo = getLine('Cura:');
  const local = getLine('Local:');

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-purple-500/8 p-4">
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
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                🌾 Colhida há {harvestDays} dias
              </span>
            )}
            {plant.actual_yield && (
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                ⚖️ {plant.actual_yield}g
              </span>
            )}
          </div>

          {(secagem || curaInfo || local) && (
            <div className="mt-2 space-y-0.5">
              {secagem && <p className="text-sm text-muted-foreground">🌬️ Secagem: {secagem}</p>}
              {curaInfo && <p className="text-sm text-muted-foreground">🫙 Cura: {curaInfo}</p>}
              {local && local !== '—' && <p className="text-sm text-muted-foreground">📍 {local}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-purple-500/15">
        <Link to={`/plant/${plant.id}`} onClick={onClose}
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/15 transition-all">
          <ExternalLink className="w-3.5 h-3.5" />
          Ver planta
        </Link>

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-300">Confirmar?</span>
            <button onClick={handleDelete} disabled={deleting}
              className="h-8 px-3 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50">
              {deleting ? '...' : 'Sim'}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="h-8 px-3 rounded-xl border border-border/50 text-muted-foreground text-xs hover:text-foreground">
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  );
}