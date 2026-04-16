import { useState } from 'react';
import { X, Droplets, Scissors, Eye, AlertTriangle, Camera, Sprout, FlaskConical, Ruler, Upload, Bug, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const logTypes = [
  { value: 'rega', label: 'Rega', icon: Droplets, color: 'text-blue-400' },
  { value: 'nutrição', label: 'Nutrição', icon: FlaskConical, color: 'text-green-400' },
  { value: 'poda', label: 'Poda', icon: Scissors, color: 'text-orange-400' },
  { value: 'treinamento', label: 'Treino', icon: Sprout, color: 'text-purple-400' },
  { value: 'defoliação', label: 'Defoliação', icon: Leaf, color: 'text-lime-400' },
  { value: 'observação', label: 'Observação', icon: Eye, color: 'text-slate-400' },
  { value: 'medição', label: 'Medição', icon: Ruler, color: 'text-cyan-400' },
  { value: 'problema', label: 'Problema', icon: Bug, color: 'text-red-400' },
  { value: 'foto', label: 'Foto', icon: Camera, color: 'text-pink-400' },
];

export default function LogForm({ plantId, onClose, onSave, initialType = 'observação' }) {
  const [form, setForm] = useState({
    plant_id: plantId,
    type: initialType,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ph_in: '', ph_out: '',
    ec_in: '', ec_out: '',
    water_ml: '', runoff_ml: '',
    temp_air: '', humidity: '', vpd: '', co2: '',
    height_cm: '',
    photo_url: '', photo_label: '',
    nutrients_used: '',
    pest_disease: '', solution_applied: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const showWater = ['rega', 'nutrição'].includes(form.type);
  const showProblem = form.type === 'problema';
  const showNutrients = form.type === 'nutrição';
  const showPhoto = form.type === 'foto';

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('photo_url', file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form };
    const numFields = ['ph_in', 'ph_out', 'ec_in', 'ec_out', 'water_ml', 'runoff_ml', 'temp_air', 'humidity', 'vpd', 'co2', 'height_cm'];
    numFields.forEach(k => {
      if (data[k] === '' || data[k] === undefined) delete data[k];
      else data[k] = Number(data[k]);
    });
    // cleanup empty strings
    Object.keys(data).forEach(k => { if (data[k] === '') delete data[k]; });
    const saved = await base44.entities.Log.create(data);
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="font-syne font-bold text-foreground">Novo Registro</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Type selector */}
          <div className="grid grid-cols-5 gap-2">
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

          {/* Water / Nutrition metrics */}
          {showWater && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">pH Entrada</Label>
                  <Input type="number" step="0.1" value={form.ph_in} onChange={e => set('ph_in', e.target.value)} placeholder="6.2" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">pH Saída (runoff)</Label>
                  <Input type="number" step="0.1" value={form.ph_out} onChange={e => set('ph_out', e.target.value)} placeholder="6.5" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">EC Entrada</Label>
                  <Input type="number" step="0.1" value={form.ec_in} onChange={e => set('ec_in', e.target.value)} placeholder="1.4" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">EC Saída (runoff)</Label>
                  <Input type="number" step="0.1" value={form.ec_out} onChange={e => set('ec_out', e.target.value)} placeholder="1.8" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Volume (ml)</Label>
                  <Input type="number" value={form.water_ml} onChange={e => set('water_ml', e.target.value)} placeholder="500" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Runoff (ml)</Label>
                  <Input type="number" value={form.runoff_ml} onChange={e => set('runoff_ml', e.target.value)} placeholder="150" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
                </div>
              </div>
            </>
          )}

          {showNutrients && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Nutrientes utilizados</Label>
              <textarea value={form.nutrients_used} onChange={e => set('nutrients_used', e.target.value)}
                placeholder="Ex: Grow A+B 2ml/L, Cal-Mag 1ml/L..."
                className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary/50" />
            </div>
          )}

          {/* Environment (always visible) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Temperatura Ar (°C)</Label>
              <Input type="number" step="0.1" value={form.temp_air} onChange={e => set('temp_air', e.target.value)} placeholder="24" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Umidade (%)</Label>
              <Input type="number" value={form.humidity} onChange={e => set('humidity', e.target.value)} placeholder="55" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">VPD (kPa)</Label>
              <Input type="number" step="0.01" value={form.vpd} onChange={e => set('vpd', e.target.value)} placeholder="1.0" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">CO2 (ppm)</Label>
              <Input type="number" value={form.co2} onChange={e => set('co2', e.target.value)} placeholder="800" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Altura (cm)</Label>
              <Input type="number" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} placeholder="30" className="bg-input border-border/60 rounded-xl h-10 text-sm" />
            </div>
          </div>

          {/* Problem fields */}
          {showProblem && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Praga / Doença</Label>
                <Input value={form.pest_disease} onChange={e => set('pest_disease', e.target.value)} placeholder="Ex: Ácaro, míldio, deficiência de N..." className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Solução aplicada</Label>
                <Input value={form.solution_applied} onChange={e => set('solution_applied', e.target.value)} placeholder="Ex: Neem oil 2ml/L..." className="bg-input border-border/60 rounded-xl h-10 text-sm" />
              </div>
            </div>
          )}

          {/* Photo upload */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Foto (opcional)</Label>
            <label className="block cursor-pointer">
              <div className="h-24 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 flex flex-col items-center justify-center gap-1.5 transition-colors relative overflow-hidden">
                {form.photo_url ? (
                  <img src={form.photo_url} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{uploading ? 'Enviando...' : 'Clique para enviar foto'}</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
            </label>
            {form.photo_url && (
              <Input value={form.photo_label} onChange={e => set('photo_label', e.target.value)} placeholder="Legenda da foto..." className="mt-2 bg-input border-border/60 rounded-xl h-10 text-sm" />
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Anotações</Label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="O que aconteceu hoje..."
              className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </div>
        </div>

        <div className="p-5 border-t border-border/40">
          <Button onClick={handleSave} disabled={saving || uploading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
            {saving ? 'Salvando...' : '✅ Salvar Registro'}
          </Button>
        </div>
      </div>
    </div>
  );
}