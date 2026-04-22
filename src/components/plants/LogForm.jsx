import { useState } from 'react';
import { X, Droplets, Scissors, Eye, Bug, Camera, Sprout, FlaskConical, Ruler, Upload, Leaf, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import BottomSheetPicker from '@/components/ui/BottomSheetPicker';

const logTypes = [
  { value: 'rega',        label: 'Rega',       icon: Droplets,    color: 'text-blue-400' },
  { value: 'nutrição',    label: 'Nutrição',   icon: FlaskConical,color: 'text-green-400' },
  { value: 'poda',        label: 'Poda',       icon: Scissors,    color: 'text-orange-400' },
  { value: 'treinamento', label: 'Treino',     icon: Sprout,      color: 'text-purple-400' },
  { value: 'defoliação',  label: 'Defoliação', icon: Leaf,        color: 'text-lime-400' },
  { value: 'observação',  label: 'Observação', icon: Eye,         color: 'text-slate-400' },
  { value: 'medição',     label: 'Medição',    icon: Ruler,       color: 'text-cyan-400' },
  { value: 'problema',    label: 'Problema',   icon: Bug,         color: 'text-red-400' },
  { value: 'foto',        label: 'Foto',       icon: Camera,      color: 'text-pink-400' },
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
    height_cm: '', lux: '',
    photo_url: '', photo_label: '',
    nutrients_used: '',
    pest_disease: '', solution_applied: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [typePicker, setTypePicker] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const showWater    = ['rega', 'nutrição'].includes(form.type);
  const showProblem  = form.type === 'problema';
  const showNutrients= form.type === 'nutrição';

  const currentType = logTypes.find(t => t.value === form.type) || logTypes[0];
  const TypeIcon = currentType.icon;

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
    const numFields = ['ph_in','ph_out','ec_in','ec_out','water_ml','runoff_ml','temp_air','humidity','vpd','co2','height_cm','lux'];
    numFields.forEach(k => {
      if (data[k] === '' || data[k] === undefined) delete data[k];
      else data[k] = Number(data[k]);
    });
    Object.keys(data).forEach(k => { if (data[k] === '') delete data[k]; });

    // Optimistic: call onSave immediately with a temp record, then overwrite with real one
    const tempId = `temp-${Date.now()}`;
    onSave({ ...data, id: tempId, _optimistic: true });

    const saved = await base44.entities.Log.create(data);
    onSave(saved); // parent replaces the temp record
    setSaving(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 animate-fade-in flex flex-col" style={{ maxHeight: '92dvh' }}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/40 flex-shrink-0"
               style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
            <h2 className="font-syne font-bold text-foreground">Novo Registro</h2>
            <button onClick={onClose} className="w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto flex-1">

            {/* Type picker — mobile-friendly bottom sheet */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Tipo de registro</Label>
              <button
                onClick={() => setTypePicker(true)}
                className="w-full flex items-center gap-3 px-4 h-12 rounded-xl border border-border/60 bg-input text-sm font-medium text-foreground hover:border-primary/40 transition-all"
              >
                <TypeIcon className={`w-4 h-4 flex-shrink-0 ${currentType.color}`} />
                <span className="flex-1 text-left">{currentType.label}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            </div>

            {/* Date */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Data</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="bg-input border-border/60 rounded-xl h-12 text-sm" />
            </div>

            {/* Water / Nutrition metrics */}
            {showWater && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <F label="pH Entrada"><Input type="number" step="0.1" value={form.ph_in} onChange={e => set('ph_in', e.target.value)} placeholder="6.2" /></F>
                  <F label="pH Saída (runoff)"><Input type="number" step="0.1" value={form.ph_out} onChange={e => set('ph_out', e.target.value)} placeholder="6.5" /></F>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="EC Entrada"><Input type="number" step="0.1" value={form.ec_in} onChange={e => set('ec_in', e.target.value)} placeholder="1.4" /></F>
                  <F label="EC Saída (runoff)"><Input type="number" step="0.1" value={form.ec_out} onChange={e => set('ec_out', e.target.value)} placeholder="1.8" /></F>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Volume (ml)"><Input type="number" value={form.water_ml} onChange={e => set('water_ml', e.target.value)} placeholder="500" /></F>
                  <F label="Runoff (ml)"><Input type="number" value={form.runoff_ml} onChange={e => set('runoff_ml', e.target.value)} placeholder="150" /></F>
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

            {/* Environment */}
            <div className="grid grid-cols-2 gap-3">
              <F label="Temperatura Ar (°C)"><Input type="number" step="0.1" value={form.temp_air} onChange={e => set('temp_air', e.target.value)} placeholder="24" /></F>
              <F label="Umidade (%)"><Input type="number" value={form.humidity} onChange={e => set('humidity', e.target.value)} placeholder="55" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="VPD (kPa)"><Input type="number" step="0.01" value={form.vpd} onChange={e => set('vpd', e.target.value)} placeholder="1.0" /></F>
              <F label="CO2 (ppm)"><Input type="number" value={form.co2} onChange={e => set('co2', e.target.value)} placeholder="800" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="PPFD (µmol)"><Input type="number" value={form.lux} onChange={e => set('lux', e.target.value)} placeholder="600" /></F>
              <F label="Altura (cm)"><Input type="number" value={form.height_cm} onChange={e => set('height_cm', e.target.value)} placeholder="30" /></F>
            </div>

            {/* Problem fields */}
            {showProblem && (
              <div className="space-y-3">
                <F label="Praga / Doença"><Input value={form.pest_disease} onChange={e => set('pest_disease', e.target.value)} placeholder="Ex: Ácaro, míldio..." /></F>
                <F label="Solução aplicada"><Input value={form.solution_applied} onChange={e => set('solution_applied', e.target.value)} placeholder="Ex: Neem oil 2ml/L..." /></F>
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

          {/* Footer */}
          <div className="p-5 border-t border-border/40 flex-shrink-0"
               style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
            <Button onClick={handleSave} disabled={saving || uploading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
              {saving ? 'Salvando...' : '✅ Salvar Registro'}
            </Button>
          </div>
        </div>
      </div>

      {/* Type bottom sheet */}
      <BottomSheetPicker
        open={typePicker}
        onOpenChange={setTypePicker}
        title="Tipo de registro"
        options={logTypes.map(t => ({ value: t.value, label: t.label }))}
        value={form.type}
        onChange={v => set('type', v)}
      />
    </>
  );
}

function F({ label, children }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}