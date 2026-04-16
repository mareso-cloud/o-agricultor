import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PlantCharts({ logs }) {
  const data = [...logs]
    .filter(l => l.date && (l.ph_in || l.ph || l.ec_in || l.ec || l.temp_air || l.temp || l.humidity || l.height_cm))
    .reverse()
    .map(l => ({
      date: l.date ? format(new Date(l.date), 'dd/MM', { locale: ptBR }) : '',
      pH: l.ph_in || l.ph || null,
      EC: l.ec_in || l.ec || null,
      Temp: l.temp_air || l.temp || null,
      Umidade: l.humidity || null,
      Altura: l.height_cm || null,
    }));

  if (!data.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">Registre medições (pH, EC, temperatura) para ver gráficos</p>
      </div>
    );
  }

  const charts = [
    { key: 'pH', color: '#3b82f6', label: 'pH' },
    { key: 'EC', color: '#22c55e', label: 'EC (mS/cm)' },
    { key: 'Temp', color: '#f97316', label: 'Temperatura (°C)' },
    { key: 'Umidade', color: '#06b6d4', label: 'Umidade (%)' },
    { key: 'Altura', color: '#a855f7', label: 'Altura (cm)' },
  ].filter(c => data.some(d => d[c.key] !== null));

  return (
    <div className="space-y-6">
      {charts.map(({ key, color, label }) => (
        <div key={key}>
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{label}</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                contentStyle={{ background: '#1a2520', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#aaa' }}
              />
              <Line type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}