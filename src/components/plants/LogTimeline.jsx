import { Droplets, Scissors, Eye, AlertTriangle, Camera, Sprout, FlaskConical, Ruler, Leaf, Bug } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const typeConfig = {
  rega: { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Rega' },
  'nutrição': { icon: FlaskConical, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Nutrição' },
  poda: { icon: Scissors, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Poda' },
  treinamento: { icon: Sprout, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Treino' },
  'defoliação': { icon: Leaf, color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20', label: 'Defoliação' },
  'medição': { icon: Ruler, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', label: 'Medição' },
  observação: { icon: Eye, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', label: 'Observação' },
  problema: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Problema' },
  foto: { icon: Camera, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', label: 'Foto' },
};

function Tag({ color, children }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>{children}</span>;
}

function LogItem({ log }) {
  const cfg = typeConfig[log.type] || typeConfig.observação;
  const Icon = cfg.icon;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-xl border ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div className="w-px flex-1 bg-border/25 mt-2" />
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
          <span className="text-xs text-muted-foreground">
            {log.date ? format(new Date(log.date), "dd 'de' MMM", { locale: ptBR }) : ''}
          </span>
        </div>

        {/* Water/pH/EC tags */}
        {(log.ph_in || log.ph || log.ph_out || log.ec_in || log.ec || log.ec_out || log.water_ml) && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {(log.ph_in || log.ph) && <Tag color="bg-blue-500/10 text-blue-400 border-blue-500/20">pH↓ {log.ph_in || log.ph}</Tag>}
            {log.ph_out && <Tag color="bg-blue-500/10 text-blue-400 border-blue-500/20">pH↑ {log.ph_out}</Tag>}
            {(log.ec_in || log.ec) && <Tag color="bg-green-500/10 text-green-400 border-green-500/20">EC↓ {log.ec_in || log.ec}</Tag>}
            {log.ec_out && <Tag color="bg-green-500/10 text-green-400 border-green-500/20">EC↑ {log.ec_out}</Tag>}
            {log.water_ml && <Tag color="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{log.water_ml}ml</Tag>}
          </div>
        )}

        {/* Ambiente tags */}
        {(log.temp_air || log.temp || log.humidity || log.height_cm) && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {(log.temp_air || log.temp) && <Tag color="bg-orange-500/10 text-orange-400 border-orange-500/20">🌡 {log.temp_air || log.temp}°C</Tag>}
            {log.humidity && <Tag color="bg-sky-500/10 text-sky-400 border-sky-500/20">💧 {log.humidity}%</Tag>}
            {log.height_cm && <Tag color="bg-purple-500/10 text-purple-400 border-purple-500/20">📏 {log.height_cm}cm</Tag>}
          </div>
        )}

        {log.nutrients_used && (
          <p className="text-xs text-green-300/80 mb-1 bg-green-500/5 border border-green-500/15 rounded-lg px-2 py-1">{log.nutrients_used}</p>
        )}
        {log.pest_disease && (
          <p className="text-xs text-red-300/80 mb-1">🐛 {log.pest_disease}{log.solution_applied ? ` → ${log.solution_applied}` : ''}</p>
        )}
        {log.notes && <p className="text-sm text-muted-foreground leading-relaxed">{log.notes}</p>}

        {/* Photo — only if loaded */}
        {log.photo_url && (
          <div className="mt-2">
            <img src={log.photo_url} alt={log.photo_label || 'log'}
              className="h-36 w-auto rounded-xl object-cover border border-border/40"
              onError={e => { e.target.style.display = 'none'; }}
            />
            {log.photo_label && <p className="text-xs text-muted-foreground mt-1">{log.photo_label}</p>}
          </div>
        )}
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