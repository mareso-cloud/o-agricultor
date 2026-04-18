import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, Plus, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const categories = [
  { value: 'rega', label: 'Rega', emoji: '💧' },
  { value: 'nutrição', label: 'Nutrição', emoji: '🧪' },
  { value: 'poda', label: 'Poda', emoji: '✂️' },
  { value: 'defoliação', label: 'Defoliação', emoji: '🍃' },
  { value: 'treinamento', label: 'Treino', emoji: '🌿' },
  { value: 'transplante', label: 'Transplante', emoji: '🪴' },
  { value: 'medição', label: 'Medição', emoji: '📏' },
  { value: 'outro', label: 'Outro', emoji: '📌' },
];

export default function RemindersTab({ plants }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => base44.entities.Reminder.list('-created_date'),
  });

  const toggle = async (r) => {
    await base44.entities.Reminder.update(r.id, { done: !r.done });
    queryClient.invalidateQueries({ queryKey: ['reminders'] });
  };

  const remove = async (id) => {
    await base44.entities.Reminder.delete(id);
    queryClient.invalidateQueries({ queryKey: ['reminders'] });
  };

  const pending = reminders.filter(r => !r.done);
  const done = reminders.filter(r => r.done);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne text-lg font-bold text-foreground">Lembretes</h2>
        <Button onClick={() => setShowForm(true)} size="sm" className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Novo
        </Button>
      </div>

      {reminders.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card p-8 flex flex-col items-center text-center">
          <Bell className="w-8 h-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">Sem lembretes ainda</p>
          <p className="text-xs text-muted-foreground mb-4">Planeje o que vai fazer essa semana</p>
          <Button onClick={() => setShowForm(true)} size="sm" className="bg-primary gap-1.5 glow-green">
            <Plus className="w-3.5 h-3.5" /> Criar lembrete
          </Button>
        </div>
      )}

      {showForm && (
        <ReminderForm plants={plants} onClose={() => setShowForm(false)} onSave={() => {
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
          setShowForm(false);
        }} />
      )}

      {pending.length > 0 && (
        <div className="space-y-2 mb-4">
          {pending.map(r => <ReminderCard key={r.id} reminder={r} plants={plants} onToggle={toggle} onDelete={remove} />)}
        </div>
      )}

      {done.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 mt-4">Concluídos</p>
          <div className="space-y-2 opacity-60">
            {done.map(r => <ReminderCard key={r.id} reminder={r} plants={plants} onToggle={toggle} onDelete={remove} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ReminderCard({ reminder, plants, onToggle, onDelete }) {
  const cat = categories.find(c => c.value === reminder.category) || categories[7];
  const plant = plants?.find(p => p.id === reminder.plant_id);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${reminder.done ? 'border-border/30 bg-muted/30' : 'border-border/50 bg-card card-hover'}`}>
      <button onClick={() => onToggle(reminder)} className="mt-0.5 flex-shrink-0">
        {reminder.done
          ? <CheckCircle2 className="w-5 h-5 text-primary" />
          : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{cat.emoji}</span>
          <p className={`text-sm font-medium ${reminder.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {reminder.title}
          </p>
        </div>
        {reminder.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{reminder.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-1.5">
          {plant && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              🌿 {plant.name}
            </span>
          )}
          {reminder.due_date && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              {format(new Date(reminder.due_date), "dd/MM", { locale: ptBR })}
            </span>
          )}
        </div>
      </div>
      <button onClick={() => onDelete(reminder.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ReminderForm({ plants, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', due_date: '', category: 'outro', plant_id: '', done: false });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const data = { ...form };
    if (!data.due_date) delete data.due_date;
    if (!data.plant_id) delete data.plant_id;
    await base44.entities.Reminder.create(data);
    onSave();
    setSaving(false);
  };

  return (
    <div className="mb-4 p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">O que fazer?</Label>
        <Input value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="Ex: Aumentar fertilizante, fazer poda..."
          className="bg-input border-border/60 rounded-xl h-10 text-sm" />
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {categories.map(cat => (
          <button key={cat.value} onClick={() => set('category', cat.value)}
            className={`flex flex-col items-center gap-0.5 py-2 rounded-xl border text-xs transition-all ${form.category === cat.value ? 'bg-primary/15 border-primary/40 text-foreground' : 'border-border/50 text-muted-foreground hover:border-border'}`}>
            <span>{cat.emoji}</span>
            <span className="text-[10px]">{cat.label}</span>
          </button>
        ))}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Detalhes (opcional)</Label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Ex: Aumentar de 2ml/L para 3ml/L de base grow..."
          className="w-full bg-input border border-border/60 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary/50" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Data prevista</Label>
          <Input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
            className="bg-input border-border/60 rounded-xl h-10 text-sm" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Planta (opcional)</Label>
          <select value={form.plant_id} onChange={e => set('plant_id', e.target.value)}
            className="w-full bg-input border border-border/60 rounded-xl h-10 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
            <option value="">Todas</option>
            {plants?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={onClose} variant="ghost" size="sm" className="flex-1">Cancelar</Button>
        <Button onClick={handleSave} disabled={saving || !form.title.trim()} size="sm" className="flex-1 bg-primary glow-green">
          {saving ? 'Salvando...' : '✅ Salvar'}
        </Button>
      </div>
    </div>
  );
}