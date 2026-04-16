import { useState } from 'react';
import { X, Upload, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const stages = ['germinação', 'muda', 'vegetativo', 'floração', 'colheita', 'cura'];
const mediums = ['terra', 'coco', 'hidroponia', 'aeroponia', 'soilless'];
const lightTypes = ['LED', 'HPS', 'CMH/LEC', 'T5/CFL', 'luz natural'];
const schedules = ['18/6', '20/4', '24/0', '12/12', '14/10'];
const seedTypes = ['feminizada', 'automática', 'regular'];
const potTypes = ['plástico', 'smart pot', 'air pot', 'airpot rígido'];
const trainings = ['none', 'LST', 'HST', 'SCROG', 'SOG', 'mainline', 'lolipop'];

export default function PlantForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', strain: '', breeder: '', seed_type: 'feminizada',
    stage: 'germinação', medium: 'terra',
    start_date: new Date().toISOString().split('T')[0],
    flip_date: '', harvest_date: '',
    pot_size: '', pot_type: 'plástico', tent: '',
    light_type: 'LED', light_power: '', light_schedule: '18/6',
    training: 'none', nutrient_brand: '', nutrient_line: '',
    expected_yield: '', notes: '', photo_url: '', status: 'ativa'
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
    const data = { ...form };
    ['pot_size', 'light_power', 'expected_yield'].forEach(k => {
      if (!data[k]) delete data[k]; else data[k] = Number(data[k]);
    });
    ['flip_date', 'harvest_date'].forEach(k => { if (!data[k]) delete data[k]; });
    const saved = await base44.entities.Plant.create(data);
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-syne font-bold text-foreground">Nova Planta</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Photo */}
          <label className="block cursor-pointer">
            <div className="h-24 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 flex flex-col items-center justify-center gap-1.5 transition-colors relative overflow-hidden">
              {form.photo_url ? (
                <img src={form.photo_url} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{uploading ? 'Enviando...' : 'Foto (opcional)'}</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} disabled={uploading} />
          </label>

          <Section label="Identificação">
            <div className="grid grid-cols-2 gap-3">
              <F label="Nome *"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Planta #1" /></F>
              <F label="Strain"><Input value={form.strain} onChange={e => set('strain', e.target.value)} placeholder="Ex: White Widow" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Breeder"><Input value={form.breeder} onChange={e => set('breeder', e.target.value)} placeholder="Ex: Royal Queen" /></F>
              <F label="Tipo de semente"><Chips options={seedTypes} value={form.seed_type} onChange={v => set('seed_type', v)} /></F>
            </div>
          </Section>

          <Section label="Fase">
            <F label="Estágio atual">
              <div className="grid grid-cols-3 gap-2">
                {stages.map(s => (
                  <button key={s} onClick={() => set('stage', s)}
                    className={`py-2 rounded-xl border text-xs font-medium transition-all ${form.stage === s ? 'bg-primary/20 border-primary/50 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </F>
            <div className="grid grid-cols-3 gap-3">
              <F label="Início"><Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} /></F>
              <F label="Virada 12/12"><Input type="date" value={form.flip_date} onChange={e => set('flip_date', e.target.value)} /></F>
              <F label="Colheita prevista"><Input type="date" value={form.harvest_date} onChange={e => set('harvest_date', e.target.value)} /></F>
            </div>
          </Section>

          <Section label="Ambiente & Setup">
            <div className="grid grid-cols-2 gap-3">
              <F label="Substrato"><Chips options={mediums} value={form.medium} onChange={v => set('medium', v)} /></F>
              <F label="Tipo de vaso"><Chips options={potTypes} value={form.pot_type} onChange={v => set('pot_type', v)} /></F>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <F label="Vaso (L)"><Input type="number" value={form.pot_size} onChange={e => set('pot_size', e.target.value)} placeholder="20" /></F>
              <F label="Tent / Ambiente"><Input value={form.tent} onChange={e => set('tent', e.target.value)} placeholder="Tent A" /></F>
              <F label="Potência Luz (W)"><Input type="number" value={form.light_power} onChange={e => set('light_power', e.target.value)} placeholder="400" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Tipo de luz"><Chips options={lightTypes} value={form.light_type} onChange={v => set('light_type', v)} /></F>
              <F label="Fotoperíodo"><Chips options={schedules} value={form.light_schedule} onChange={v => set('light_schedule', v)} /></F>
            </div>
            <F label="Técnica de treino"><Chips options={trainings} value={form.training} onChange={v => set('training', v)} /></F>
          </Section>

          <Section label="Nutrição">
            <div className="grid grid-cols-2 gap-3">
              <F label="Marca"><Input value={form.nutrient_brand} onChange={e => set('nutrient_brand', e.target.value)} placeholder="Ex: Plagron" /></F>
              <F label="Linha"><Input value={form.nutrient_line} onChange={e => set('nutrient_line', e.target.value)} placeholder="Ex: Alga Bloom" /></F>
            </div>
          </Section>

          <F label="Observações">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anotações iniciais..."
              className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary/50" />
          </F>
        </div>

        <div className="p-5 border-t border-border/40">
          <Button onClick={handleSave} disabled={!form.name.trim() || saving}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
            {saving ? 'Salvando...' : '🌱 Adicionar Planta'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">{label}</p>
      <div className="space-y-3">{children}</div>
    </div>
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

function Chips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium transition-all ${value === opt ? 'bg-primary/20 border-primary/50 text-primary' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}