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
            {plants.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {plants.length}
              </span>
            )}
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

  // Parse notes
  const notes = plant.notes || '';
  const lines = notes.split('\n');
  const getLine = (prefix) => {
    const line = lines.find(l => l.startsWith(prefix));
    return line ? line.replace(prefix, '').trim() : null;
  };

  const rendimento = plant.actual_yield ? `${plant.actual_yield}g` : getLine('Rendimento real:');
  const secagem = getLine('Secagem:');
  const curaInfo = getLine('Cura:');
  const local = getLine('Local:');

  // Cure start date from notes
  const cureStartStr = getLine('Início cura:');
  const cureDays = cureStartStr
    ? differenceInDays(new Date(), new Date(cureStartStr))
    : null;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <div className="rounded-2xl border border-purple-500/25 bg-purple-500/8 overflow-hidden">
      {/* Main content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Foto */}
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {plant.photo_url
              ? <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
              : <Leaf className="w-5 h-5 text-purple-400" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-foreground">{plant.name}</p>
                {plant.strain && <p className="text-xs text-muted-foreground">{plant.strain}</p>}
              </div>
              {rendimento && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 flex-shrink-0">
                  ⚖️ {rendimento}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dias — destaque */}
        <div className="flex gap-3 mt-3">
          {harvestDays !== null && (
            <div className="flex-1 rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 text-center">
              <p className="text-2xl font-bold text-amber-300">{harvestDays}</p>
              <p className="text-xs text-amber-400/80 mt-0.5">dias desde colheita</p>
            </div>
          )}
          {cureDays !== null && (
            <div className="flex-1 rounded-xl bg-purple-500/10 border border-purple-500/25 p-3 text-center">
              <p className="text-2xl font-bold text-purple-300">{cureDays}</p>
              <p className="text-xs text-purple-400/80 mt-0.5">dias de cura</p>
            </div>
          )}
          {harvestDays === null && cureDays === null && (
            <div className="flex-1 rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
              <p className="text-xs text-muted-foreground">Sem data registrada</p>
            </div>
          )}
        </div>

        {/* Extras */}
        {(secagem || curaInfo || local) && (
          <div className="mt-3 space-y-1">
            {secagem && <p className="text-xs text-muted-foreground">🌬️ Secagem: {secagem}</p>}
            {curaInfo && <p className="text-xs text-muted-foreground">🫙 Cura: {curaInfo}</p>}
            {local && local !== '—' && <p className="text-xs text-muted-foreground">📍 {local}</p>}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex border-t border-purple-500/20">
        <Link to={`/plant/${plant.id}`} onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-purple-300 hover:bg-purple-500/10 transition-all font-medium">
          <ExternalLink className="w-3.5 h-3.5" />
          Ver planta
        </Link>

        <div className="w-px bg-purple-500/20" />

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-red-400 hover:bg-red-500/10 transition-all font-medium">
            <Trash2 className="w-3.5 h-3.5" />
            Excluir planta
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 py-3 px-3">
            <span className="text-xs text-red-300">Confirmar?</span>
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50">
              {deleting ? '...' : 'Sim'}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="text-xs px-2.5 py-1 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground">
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  );
}