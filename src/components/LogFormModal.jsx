import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function LogFormModal({ plantId, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    plant_id: plantId,
    type: 'rega',
    date: new Date().toISOString().split('T')[0],
    ph: '',
    ec: '',
    water_ml: '',
    temp: '',
    humidity: '',
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Log.create({
      ...data,
      ph: data.ph ? Number(data.ph) : undefined,
      ec: data.ec ? Number(data.ec) : undefined,
      water_ml: data.water_ml ? Number(data.water_ml) : undefined,
      temp: data.temp ? Number(data.temp) : undefined,
      humidity: data.humidity ? Number(data.humidity) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs', plantId] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      onClose();
    },
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const showMeasurements = ['rega', 'nutrição', 'medição'].includes(form.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-playfair text-xl font-bold">Novo Registro</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Tipo</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rega">💧 Rega</SelectItem>
                  <SelectItem value="nutrição">🧪 Nutrição</SelectItem>
                  <SelectItem value="poda">✂️ Poda</SelectItem>
                  <SelectItem value="foto">📷 Foto</SelectItem>
                  <SelectItem value="medição">📏 Medição</SelectItem>
                  <SelectItem value="observação">📝 Observação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Data</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="bg-background" />
            </div>

            {showMeasurements && (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">pH</Label>
                  <Input type="number" step="0.1" value={form.ph} onChange={e => set('ph', e.target.value)} placeholder="6.5" className="bg-background" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">EC</Label>
                  <Input type="number" step="0.1" value={form.ec} onChange={e => set('ec', e.target.value)} placeholder="1.4" className="bg-background" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Volume (ml)</Label>
                  <Input type="number" value={form.water_ml} onChange={e => set('water_ml', e.target.value)} placeholder="500" className="bg-background" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Temperatura °C</Label>
                  <Input type="number" value={form.temp} onChange={e => set('temp', e.target.value)} placeholder="25" className="bg-background" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Umidade %</Label>
                  <Input type="number" value={form.humidity} onChange={e => set('humidity', e.target.value)} placeholder="60" className="bg-background" />
                </div>
              </>
            )}

            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Observações</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notas..." className="bg-background resize-none" rows={3} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="flex-1 bg-primary glow-green-sm"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Registro'}
          </Button>
        </div>
      </div>
    </div>
  );
}