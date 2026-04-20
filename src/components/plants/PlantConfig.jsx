import { useState } from 'react';
import { Save, FlaskConical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import CurePanel from './CurePanel';

const stages = ['germinação', 'muda', 'vegetativo', 'floração', 'colheita', 'cura'];
const mediums = ['terra', 'coco', 'hidroponia', 'aeroponia', 'soilless'];
const lightTypes = ['LED', 'HPS', 'CMH/LEC', 'T5/CFL', 'luz natural'];
const schedules = ['18/6', '20/4', '24/0', '12/12', '14/10'];
const statuses = ['ativa', 'pausada', 'colhida', 'perdida'];

export default function PlantConfig({ plant, onUpdate }) {
  const [form, setForm] = useState({ ...plant });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCure, setShowCure] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const updated = await base44.entities.Plant.update(plant.id, form);
    onUpdate(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <Section label="Identificação">
        <Row2>
          <Field label="Nome"><Input value={form.name || ''} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="Strain"><Input value={form.strain || ''} onChange={e => set('strain', e.target.value)} /></Field>
        </Row2>
        <Row2>
          <Field label="Breeder"><Input value={form.breeder || ''} onChange={e => set('breeder', e.target.value)} /></Field>
          <Field label="Status">
            <Chips options={statuses} value={form.status} onChange={v => set('status', v)} />
          </Field>
        </Row2>
      </Section>

      <Section label="Fase">
        <Field label="Estágio">
          <Chips options={stages} value={form.stage} onChange={v => set('stage', v)} />
        </Field>
        <Row3>
          <Field label="Início"><Input type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value)} /></Field>
          <Field label="Virada (12/12)"><Input type="date" value={form.flip_date || ''} onChange={e => set('flip_date', e.target.value)} /></Field>
          <Field label="Colheita prevista"><Input type="date" value={form.harvest_date || ''} onChange={e => set('harvest_date', e.target.value)} /></Field>
        </Row3>
      </Section>

      <Section label="Ambiente">
        <Row3>
          <Field label="Substrato"><Chips options={mediums} value={form.medium} onChange={v => set('medium', v)} /></Field>
          <Field label="Vaso (L)"><Input type="number" value={form.pot_size || ''} onChange={e => set('pot_size', e.target.value)} placeholder="20" /></Field>
          <Field label="Tent"><Input value={form.tent || ''} onChange={e => set('tent', e.target.value)} placeholder="Tent A" /></Field>
        </Row3>
        <Row3>
          <Field label="Luz"><Chips options={lightTypes} value={form.light_type} onChange={v => set('light_type', v)} /></Field>
          <Field label="Potência (W)"><Input type="number" value={form.light_power || ''} onChange={e => set('light_power', e.target.value)} placeholder="400" /></Field>
          <Field label="Fotoperíodo"><Chips options={schedules} value={form.light_schedule} onChange={v => set('light_schedule', v)} /></Field>
        </Row3>
      </Section>

      <Section label="Nutrição">
        <Row2>
          <Field label="Marca 1"><Input value={form.nutrient_brand || ''} onChange={e => set('nutrient_brand', e.target.value)} placeholder="Ex: Plagron" /></Field>
          <Field label="Dose (ml/L)"><Input value={form.nutrient_dose_ml || ''} onChange={e => set('nutrient_dose_ml', e.target.value)} placeholder="Ex: 2ml vega / 2ml micro" /></Field>
        </Row2>
        <Row2>
          <Field label="Marca 2"><Input value={form.nutrient_brand2 || ''} onChange={e => set('nutrient_brand2', e.target.value)} placeholder="Ex: BioBizz" /></Field>
          <Field label="Dose (ml/L)"><Input value={form.nutrient_dose_ml2 || ''} onChange={e => set('nutrient_dose_ml2', e.target.value)} placeholder="Ex: 1ml bloom" /></Field>
        </Row2>
      </Section>

      <Section label="Rendimento">
        <Row2>
          <Field label="Esperado (g)"><Input type="number" value={form.expected_yield || ''} onChange={e => set('expected_yield', e.target.value)} placeholder="100" /></Field>
          <Field label="Real (g)"><Input type="number" value={form.actual_yield || ''} onChange={e => set('actual_yield', e.target.value)} placeholder="85" /></Field>
        </Row2>
      </Section>

      <Field label="Observações">
        <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)}
          className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="Notas gerais..." />
      </Field>

      <div className="flex flex-wrap gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all glow-green">
          <Save className="w-4 h-4" />
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button onClick={() => setShowCure(true)}
          className="flex items-center gap-2 h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-lg">
          <FlaskConical className="w-4 h-4" />
          Finalizar Cultivo
        </button>
      </div>

      {showCure && (
        <CurePanel
          plant={plant}
          onClose={() => setShowCure(false)}
          onUpdate={(updated) => { onUpdate(updated); setShowCure(false); }}
        />
      )}
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

function Field({ label, children }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function Row2({ children }) { return <div className="grid grid-cols-2 gap-3">{children}</div>; }
function Row3({ children }) { return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{children}</div>; }

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