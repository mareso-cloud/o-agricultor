import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

const fields = [
  { key: 'ph_in',     label: 'pH Entrada',      placeholder: '6.2', step: '0.1' },
  { key: 'ph_out',    label: 'pH Saída (runoff)', placeholder: '6.5', step: '0.1' },
  { key: 'ec_in',     label: 'EC Entrada',       placeholder: '1.4', step: '0.1' },
  { key: 'ec_out',    label: 'EC Saída (runoff)', placeholder: '1.8', step: '0.1' },
  { key: 'lux',       label: 'PPFD (µmol)',       placeholder: '600' },
  { key: 'temp_air',  label: 'Temperatura (°C)',  placeholder: '24',  step: '0.1' },
  { key: 'humidity',  label: 'Umidade (%)',        placeholder: '55' },
  { key: 'vpd',       label: 'VPD (kPa)',          placeholder: '1.0', step: '0.01' },
  { key: 'co2',       label: 'CO2 (ppm)',          placeholder: '800' },
  { key: 'height_cm', label: 'Altura (cm)',         placeholder: '30' },
];

export default function StatusEditor({ plantId, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const data = {
      plant_id: plantId,
      type: 'medição',
      date: new Date().toISOString().split('T')[0],
    };
    fields.forEach(({ key }) => {
      if (form[key] !== '' && form[key] !== undefined) {
        data[key] = Number(form[key]);
      }
    });
    const saved = await base44.entities.Log.create(data);
    onSave(saved);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-border/60 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h2 className="font-syne font-bold text-foreground">Atualizar Status</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-muted-foreground">Preencha os valores que deseja atualizar. Um log de medição será criado automaticamente.</p>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ key, label, placeholder, step }) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
                <Input
                  type="number"
                  step={step || '1'}
                  value={form[key] || ''}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="bg-input border-border/60 rounded-xl h-10 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-border/40">
          <button onClick={handleSave} disabled={saving}
            className="w-full h-11 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl glow-green transition-all text-sm">
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Medição'}
          </button>
        </div>
      </div>
    </div>
  );
}