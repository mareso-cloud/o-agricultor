import { Droplets, Scissors, Eye, AlertTriangle, Camera, Sprout, FlaskConical, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const typeConfig = {
  rega: { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Rega' },
  'nutrição': { icon: FlaskConical, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Nutrição' },
  poda: { icon: Scissors, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Poda' },
  treinamento: { icon: Sprout, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Treino' },
  observação: { icon: Eye, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'Observação' },
  problema: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Problema' },
  foto: { icon: Camera, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Foto' },
};

function LogItem({ log }) {
  const cfg = typeConfig[log.type] || typeConfig.observação;
  const Icon = cfg.icon;

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-xl border ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div className="w-px flex-1 bg-border/30 mt-2" />
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
          <span className="text-xs text-muted-foreground">
            {log.date ? format(new Date(log.date), "dd 'de' MMM", { locale: ptBR }) : ''}
          </span>
        </div>
        {(log.ph || log.ec || log.water_ml) && (
          <div className="flex gap-3 mb-1.5">
            {log.ph && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">pH {log.ph}</span>}
            {log.ec && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">EC {log.ec}</span>}
            {log.water_ml && <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">{log.water_ml}ml</span>}
          </div>
        )}
        {(log.temp || log.humidity) && (
          <div className="flex gap-3 mb-1.5">
            {log.temp && <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">🌡 {log.temp}°C</span>}
            {log.humidity && <span className="text-xs bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/20">💧 {log.humidity}%</span>}
          </div>
        )}
        {log.notes && <p className="text-sm text-muted-foreground leading-relaxed">{log.notes}</p>}
        {log.photo_url && <img src={log.photo_url} alt="log" className="mt-2 h-32 w-auto rounded-xl object-cover border border-border/40" />}
      </div>
    </div>
  );
}

export default function LogTimeline({ logs }) {
  if (!logs.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Nenhum registro ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map(log => <LogItem key={log.id} log={log} />)}
    </div>
  );
}