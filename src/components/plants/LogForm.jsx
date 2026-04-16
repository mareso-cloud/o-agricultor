import { useState } from 'react';
import { X, Droplets, Scissors, Eye, AlertTriangle, Camera, Sprout, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const logTypes = [
  { value: 'rega', label: 'Rega', icon: Droplets, color: 'text-blue-400' },
  { value: 'nutrição', label: 'Nutrição', icon: FlaskConical, color: 'text-green-400' },
  { value: 'poda', label: 'Poda', icon: Scissors, color: 'text-orange-400' },
  { value: 'treinamento', label: 'Treino', icon: Sprout, color: 'text-purple-400' },
  { value: 'observação', label: 'Observação', icon: Eye, color: 'text-slate-400' },
  { value: 'problema', label: 'Problema', icon: AlertTriangle, color: 'text-red-400' },
  { value: 'foto', label: 'Foto', icon: Camera, color: 'text-pink-400' },
];

export default function LogForm({ plantId, onClose, onSave }) {
  const [form, setForm] = useState({
    plant_id: plantId,
    type: 'rega',
    date: new Date().toISOString().split('T')[0],
    notes: '', ph: '', ec: '', water_ml: '', temp: '', humidity: '', photo_url: ''
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const showWater = ['rega', 'nutrição'].includes(form.type);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form };
    ['ph', 'ec', 'water_ml', 'temp', 'humidity'].forEach(k => { if (data[k] === '') delete data[k]; else data[k] = Number(data[k]); });
    const saved = await base44.entities.Log.create(data);
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="font-syne font-bold text-foreground">Novo Registro</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type selector */}
          <div className="grid grid-cols-4 gap-2">
            {logTypes.map(({ value, label, icon: Icon, color }) => (
              <button key={value} onClick={() => set('type', value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs transition-all ${form.type === value ? 'bg-primary/15 border-primary/40 text-foreground' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
                <Icon className={`w-4 h-4 ${form.type === value ? color : ''}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Date */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Data</Label>
            <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="bg-input border-border/60 rounded-xl h-10 text-sm" />
          </div>

          {/* Water metrics */}
          {showWater && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">pH</Label>
                <Input type="number" step="0.1" value={form.ph} onChange={e => set('ph', e.target.value)} placeholder="6.2" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">EC</Label>
                <Input type="number" step="0.1" value={form.ec} onChange={e => set('ec', e.target.value)} placeholder="1.4" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Volume (ml)</Label>
                <Input type="number" value={form.water_ml} onChange={e => set('water_ml', e.target.value)} placeholder="500" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>
            </div>
          )}

          {/* Ambiente */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Temperatura (°C)</Label>
              <Input type="number" value={form.temp} onChange={e => set('temp', e.target.value)} placeholder="24" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Umidade (%)</Label>
              <Input type="number" value={form.humidity} onChange={e => set('humidity', e.target.value)} placeholder="55" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Anotações</Label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="O que aconteceu hoje..."
              className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
        </div>

        <div className="p-5 border-t border-border/40">
          <Button onClick={handleSave} disabled={saving}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
            {saving ? 'Salvando...' : '✅ Salvar Registro'}
          </Button>
        </div>
      </div>
    </div>
  );
}