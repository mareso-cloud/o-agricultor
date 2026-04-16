import { useState } from 'react';
import { X, Upload, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const stages = [
  { value: 'germinacao', label: '🌱 Germinação' },
  { value: 'vegetativo', label: '🌿 Vegetativo' },
  { value: 'floracao', label: '🌸 Floração' },
  { value: 'colheita', label: '🌾 Colheita' },
];

const mediums = [
  { value: 'solo', label: '🪴 Solo' },
  { value: 'coco', label: '🥥 Coco' },
  { value: 'hidroponia', label: '💧 Hidroponia' },
  { value: 'aeroponia', label: '🌬️ Aeroponia' },
];

export default function PlantForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', strain: '', stage: 'germinacao', medium: 'solo',
    start_date: new Date().toISOString().split('T')[0],
    pot_size: '', tent: '', notes: '', photo_url: '', status: 'ativa'
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('photo_url', file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const saved = await base44.entities.Plant.create(form);
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-syne font-bold text-foreground">Nova Planta</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Photo */}
          <label className="block">
            <div className="h-32 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative overflow-hidden">
              {form.photo_url ? (
                <img src={form.photo_url} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{uploading ? 'Enviando...' : 'Foto da planta (opcional)'}</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
          </label>

          {/* Name & Strain */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Nome *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Amnesia" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Genética</Label>
              <Input value={form.strain} onChange={e => set('strain', e.target.value)} placeholder="Ex: Sativa" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
          </div>

          {/* Stage */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Fase</Label>
            <div className="grid grid-cols-4 gap-2">
              {stages.map(s => (
                <button key={s.value} onClick={() => set('stage', s.value)}
                  className={`py-2 px-1 rounded-xl border text-xs font-medium transition-all ${form.stage === s.value ? 'bg-primary/20 border-primary/50 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medium */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Substrato</Label>
            <div className="grid grid-cols-4 gap-2">
              {mediums.map(m => (
                <button key={m.value} onClick={() => set('medium', m.value)}
                  className={`py-2 px-1 rounded-xl border text-xs font-medium transition-all ${form.medium === m.value ? 'bg-primary/20 border-primary/50 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Início</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Vaso (L)</Label>
              <Input type="number" value={form.pot_size} onChange={e => set('pot_size', e.target.value)} placeholder="20" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Grow Tent</Label>
              <Input value={form.tent} onChange={e => set('tent', e.target.value)} placeholder="Tent A" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Observações</Label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anotações iniciais..."
              className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
        </div>

        <div className="p-5 border-t border-border/40">
          <Button onClick={handleSave} disabled={!form.name.trim() || saving}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green transition-all">
            {saving ? 'Salvando...' : '🌱 Adicionar Planta'}
          </Button>
        </div>
      </div>
    </div>
  );
}