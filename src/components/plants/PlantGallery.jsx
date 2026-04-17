import { Camera, Plus, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function PlantGallery({ logs, plant, onAddPhoto, onDeleteLog }) {
  const [selected, setSelected] = useState(null);

  const handleDelete = async (log, e) => {
    e.stopPropagation();
    if (!confirm('Apagar esta foto definitivamente?')) return;
    await base44.entities.Log.delete(log.id);
    if (selected?.id === log.id) setSelected(null);
    onDeleteLog(log.id);
  };

  if (!logs.length) {
    return (
      <div className="text-center py-12">
        <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">Nenhuma foto registrada ainda</p>
        <button onClick={onAddPhoto}
          className="flex items-center gap-2 mx-auto h-9 px-4 rounded-xl bg-primary/15 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/25 transition-all">
          <Plus className="w-4 h-4" /> Adicionar Foto
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{logs.length} foto{logs.length > 1 ? 's' : ''}</p>
        <button onClick={onAddPhoto}
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-all">
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {logs.map(log => (
          <div key={log.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all cursor-pointer" onClick={() => setSelected(log)}>
            <img src={log.photo_url} alt={log.photo_label || log.type}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white font-medium truncate">{log.photo_label || log.type}</p>
              {log.date && <p className="text-xs text-white/70">{format(new Date(log.date), 'dd MMM', { locale: ptBR })}</p>}
            </div>
            <button onClick={(e) => handleDelete(log, e)}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
            <img src={selected.photo_url} alt={selected.photo_label || ''} className="w-full rounded-2xl object-contain max-h-[70vh]" />
            <div className="mt-3 text-center">
              {selected.photo_label && <p className="text-white font-medium">{selected.photo_label}</p>}
              {selected.date && <p className="text-white/60 text-sm mt-1">{format(new Date(selected.date), "dd 'de' MMMM yyyy", { locale: ptBR })}</p>}
              {selected.notes && <p className="text-white/70 text-sm mt-2">{selected.notes}</p>}
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-0 right-0 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <X className="w-4 h-4" />
            </button>
            <button onClick={(e) => handleDelete(selected, e)}
              className="mt-4 flex items-center gap-1.5 mx-auto h-8 px-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Apagar foto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}