import { X, Droplets, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function WateringsModal({ logs, plants, onClose }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const wateringsToday = logs.filter(l => l.type === 'rega' && l.date === today);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-blue-500/40 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <h2 className="font-syne font-bold text-foreground">Regas Hoje</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {wateringsToday.length}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {wateringsToday.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Droplets className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma rega registrada hoje</p>
            </div>
          ) : (
            wateringsToday.map(log => {
              const plant = plants.find(p => p.id === log.plant_id);
              return (
                <div key={log.id} className="flex items-start gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/8 p-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {plant?.photo_url
                      ? <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
                      : <Leaf className="w-5 h-5 text-blue-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{plant?.name || 'Planta desconhecida'}</p>
                    {plant?.strain && <p className="text-xs text-muted-foreground">{plant.strain}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {log.water_ml && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          💧 {log.water_ml}ml
                        </span>
                      )}
                      {log.ph_in && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          pH {log.ph_in}
                        </span>
                      )}
                      {log.ec_in && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          EC {log.ec_in}
                        </span>
                      )}
                    </div>
                    {log.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{log.notes}</p>}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {format(new Date(log.date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}