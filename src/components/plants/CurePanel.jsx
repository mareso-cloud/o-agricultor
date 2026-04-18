import { useState } from 'react';
import { X, Save, FlaskConical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function CurePanel({ plant, onClose, onUpdate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    harvest_date: plant.harvest_date || new Date().toISOString().split('T')[0],
    actual_yield: plant.actual_yield || '',
    dry_start_date: '',
    dry_days: 7,
    cure_start_date: '',
    cure_weeks: 4,
    cure_location: '',
    notes: plant.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const dryEnd = form.dry_start_date
    ? new Date(new Date(form.dry_start_date).getTime() + form.dry_days * 86400000).toISOString().split('T')[0]
    : null;
  const cureEnd = form.cure_start_date
    ? new Date(new Date(form.cure_start_date).getTime() + form.cure_weeks * 7 * 86400000).toISOString().split('T')[0]
    : null;

  const handleFinalize = async () => {
    setSaving(true);
    const notes = `🌾 COLHIDA\nRendimento real: ${form.actual_yield || '—'}g\nSecagem: ${form.dry_start_date || '—'} → ${dryEnd || '—'} (${form.dry_days} dias)\nCura: ${form.cure_start_date || '—'} → ${cureEnd || '—'} (${form.cure_weeks} semanas)\nLocal: ${form.cure_location || '—'}\nObs: ${form.notes}`;
    const updated = await base44.entities.Plant.update(plant.id, {
      status: 'cura',
      stage: 'cura',
      harvest_date: form.harvest_date,
      actual_yield: form.actual_yield ? Number(form.actual_yield) : undefined,
      notes,
    });
    onUpdate(updated);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl border border-purple-500/40 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h2 className="font-syne font-bold text-foreground">Finalizar Cultivo — Cura</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          <p className="text-xs text-purple-300/70 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2">
            Ao finalizar, a planta será movida para <strong>Plantas na Cura</strong> na tela inicial.
          </p>

          <Section label="Colheita">
            <Row2>
              <Field label="Data da colheita">
                <Input type="date" value={form.harvest_date} onChange={e => set('harvest_date', e.target.value)} />
              </Field>
              <Field label="Rendimento real (g)">
                <Input type="number" value={form.actual_yield} onChange={e => set('actual_yield', e.target.value)} placeholder="85" />
              </Field>
            </Row2>
          </Section>

          <Section label="Secagem">
            <Row2>
              <Field label="Início da secagem">
                <Input type="date" value={form.dry_start_date} onChange={e => set('dry_start_date', e.target.value)} />
              </Field>
              <Field label="Dias de secagem">
                <Input type="number" value={form.dry_days} onChange={e => set('dry_days', e.target.value)} placeholder="7" min="1" />
              </Field>
            </Row2>
            {dryEnd && (
              <p className="text-xs text-muted-foreground">📅 Fim previsto da secagem: <strong className="text-foreground">{dryEnd}</strong></p>
            )}
          </Section>

          <Section label="Cura">
            <Row2>
              <Field label="Início da cura">
                <Input type="date" value={form.cure_start_date} onChange={e => set('cure_start_date', e.target.value)} />
              </Field>
              <Field label="Semanas de cura">
                <Input type="number" value={form.cure_weeks} onChange={e => set('cure_weeks', e.target.value)} placeholder="4" min="1" />
              </Field>
            </Row2>
            <Field label="Local de armazenamento">
              <Input value={form.cure_location} onChange={e => set('cure_location', e.target.value)} placeholder="Ex: Pote de vidro, lugar escuro..." />
            </Field>
            {cureEnd && (
              <p className="text-xs text-muted-foreground">📅 Cura completa em: <strong className="text-foreground">{cureEnd}</strong></p>
            )}
          </Section>

          <Field label="Observações finais">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              placeholder="Anotações sobre o cultivo..." />
          </Field>
        </div>

        <div className="p-5 border-t border-border/40">
          <button onClick={handleFinalize} disabled={saving}
            className="w-full h-11 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all text-sm shadow-lg">
            <FlaskConical className="w-4 h-4" />
            {saving ? 'Finalizando...' : '🌾 Finalizar e Iniciar Cura'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">{label}</p>
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