import { useState } from 'react';
import { X, Upload, Leaf, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import BottomSheetPicker from '@/components/ui/BottomSheetPicker';

const stages    = ['germinação','muda','vegetativo','floração','colheita','cura'];
const mediums   = ['terra','coco','hidroponia','aeroponia','soilless'];
const lightTypes= ['LED','HPS','CMH/LEC','T5/CFL','luz natural'];
const schedules = ['18/6','20/4','24/0','12/12','14/10'];
const seedTypes = ['feminizada','automática','regular'];
const potTypes  = ['plástico','smart pot','air pot','airpot rígido'];
const trainings = ['none','LST','HST','SCROG','SOG','mainline','lolipop'];

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

  // Picker state — one open at a time
  const [picker, setPicker] = useState(null); // key of the field being picked

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openPicker = (key) => setPicker(key);
  const closePicker = () => setPicker(null);
  const pickValue = (key, v) => { set(key, v); closePicker(); };

  const pickerConfigs = {
    seed_type:      { title: 'Tipo de semente', options: seedTypes },
    stage:          { title: 'Estágio atual',   options: stages },
    medium:         { title: 'Substrato',       options: mediums },
    pot_type:       { title: 'Tipo de vaso',    options: potTypes },
    light_type:     { title: 'Tipo de luz',     options: lightTypes },
    light_schedule: { title: 'Fotoperíodo',     options: schedules },
    training:       { title: 'Técnica de treino', options: trainings },
  };

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
    ['pot_size','light_power','expected_yield'].forEach(k => {
      if (!data[k]) delete data[k]; else data[k] = Number(data[k]);
    });
    ['flip_date','harvest_date'].forEach(k => { if (!data[k]) delete data[k]; });

    // Optimistic: show immediately then replace with server record
    const tempId = `temp-${Date.now()}`;
    onSave({ ...data, id: tempId, _optimistic: true });

    const saved = await base44.entities.Plant.create(data);
    onSave(saved);
    setSaving(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full sm:max-w-xl bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 flex flex-col" style={{ maxHeight: '92dvh' }}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/40 flex-shrink-0"
               style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-syne font-bold text-foreground">Nova Planta</h2>
            </div>
            <button onClick={onClose}
              className="w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5 overflow-y-auto flex-1">

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
                <F label="Tipo de semente">
                  <PickerButton value={form.seed_type} onClick={() => openPicker('seed_type')} />
                </F>
              </div>
            </Section>

            <Section label="Fase">
              <F label="Estágio atual">
                <PickerButton value={form.stage} onClick={() => openPicker('stage')} />
              </F>
              <div className="grid grid-cols-3 gap-3">
                <F label="Início"><Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} /></F>
                <F label="Virada 12/12"><Input type="date" value={form.flip_date} onChange={e => set('flip_date', e.target.value)} /></F>
                <F label="Colheita prevista"><Input type="date" value={form.harvest_date} onChange={e => set('harvest_date', e.target.value)} /></F>
              </div>
            </Section>

            <Section label="Ambiente & Setup">
              <div className="grid grid-cols-2 gap-3">
                <F label="Substrato"><PickerButton value={form.medium} onClick={() => openPicker('medium')} /></F>
                <F label="Tipo de vaso"><PickerButton value={form.pot_type} onClick={() => openPicker('pot_type')} /></F>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <F label="Vaso (L)"><Input type="number" value={form.pot_size} onChange={e => set('pot_size', e.target.value)} placeholder="20" /></F>
                <F label="Tent / Ambiente"><Input value={form.tent} onChange={e => set('tent', e.target.value)} placeholder="Tent A" /></F>
                <F label="Potência Luz (W)"><Input type="number" value={form.light_power} onChange={e => set('light_power', e.target.value)} placeholder="400" /></F>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Tipo de luz"><PickerButton value={form.light_type} onClick={() => openPicker('light_type')} /></F>
                <F label="Fotoperíodo"><PickerButton value={form.light_schedule} onClick={() => openPicker('light_schedule')} /></F>
              </div>
              <F label="Técnica de treino"><PickerButton value={form.training} onClick={() => openPicker('training')} /></F>
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

          {/* Footer */}
          <div className="p-5 border-t border-border/40 flex-shrink-0"
               style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
            <Button onClick={handleSave} disabled={!form.name.trim() || saving}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green">
              {saving ? 'Salvando...' : '🌱 Adicionar Planta'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom sheet pickers */}
      {Object.entries(pickerConfigs).map(([key, cfg]) => (
        <BottomSheetPicker
          key={key}
          open={picker === key}
          onOpenChange={(open) => { if (!open) closePicker(); }}
          title={cfg.title}
          options={cfg.options}
          value={form[key]}
          onChange={(v) => pickValue(key, v)}
        />
      ))}
    </>
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

function PickerButton({ value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 h-10 rounded-xl border border-border/60 bg-input text-sm text-foreground hover:border-primary/40 transition-all"
    >
      <span>{value}</span>
      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}