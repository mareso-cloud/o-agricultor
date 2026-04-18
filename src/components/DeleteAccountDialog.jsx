import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setConfirming(true);
    try {
      await base44.auth.logout('/');
    } catch {
      setConfirming(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs text-destructive/70 hover:text-destructive transition-colors mt-6 mx-auto"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Excluir minha conta
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h2 className="font-syne font-bold text-lg text-foreground mb-2">Excluir conta</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tem certeza? Todos os seus dados (plantas, logs, lembretes) serão apagados permanentemente. Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={confirming}
            className="flex-1 h-10 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-colors"
          >
            {confirming ? 'Aguarde...' : 'Sim, excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}