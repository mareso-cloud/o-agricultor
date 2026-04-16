import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function PlantFormModal({ plant, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!plant;

  const [form, setForm] = useState({
    name: plant?.name || '',
    strain: plant?.strain || '',
    stage: plant?.stage || 'germinação',
    medium: plant?.medium || 'terra',
    tent: plant?.tent || '',
    start_date: plant?.start_date || new Date().toISOString().split('T')[0],
    notes: plant?.notes || '',
    is_active: plant?.is_active ?? true,
  });

  const mutation = useMutation({
    mutationFn: (data) => isEdit
      ? base44.entities.Plant.update(plant.id, data)
      : base44.entities.Plant.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      onClose();
    },
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-playfair text-xl font-bold">
            {isEdit ? 'Editar Planta' : 'Nova Planta'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Nome *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Planta 1" className="bg-background" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Strain / Variedade</Label>
              <Input value={form.strain} onChange={e => set('strain', e.target.value)} placeholder="Ex: White Widow" className="bg-background" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Estágio</Label>
              <Select value={form.stage} onValueChange={v => set('stage', v)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="germinação">Germinação</SelectItem>
                  <SelectItem value="muda">Muda</SelectItem>
                  <SelectItem value="vegetativo">Vegetativo</SelectItem>
                  <SelectItem value="floração">Floração</SelectItem>
                  <SelectItem value="colheita">Colheita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Substrato</Label>
              <Select value={form.medium} onValueChange={v => set('medium', v)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="terra">Terra</SelectItem>
                  <SelectItem value="coco">Coco</SelectItem>
                  <SelectItem value="hidroponia">Hidroponia</SelectItem>
                  <SelectItem value="aeroponia">Aeroponia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Data de início</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="bg-background" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Barraca / Ambiente</Label>
              <Input value={form.tent} onChange={e => set('tent', e.target.value)} placeholder="Ex: Tent A" className="bg-background" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Observações</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notas gerais..." className="bg-background resize-none" rows={3} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={!form.name || mutation.isPending}
            className="flex-1 bg-primary glow-green-sm"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? 'Salvar' : 'Criar Planta'}
          </Button>
        </div>
      </div>
    </div>
  );
}