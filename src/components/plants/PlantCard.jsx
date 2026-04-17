import { Leaf, Droplets, Calendar, ChevronRight, Sprout } from 'lucide-react';
import StageBadge from './Stagebadge';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mediumIcon = { solo: '🪴', coco: '🥥', hidroponia: '💧', aeroponia: '🌬️' };

export default function PlantCard({ plant, onClick }) {
  const daysSince = plant.start_date ?
  differenceInDays(new Date(), new Date(plant.start_date)) :
  0;

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-border/60 gradient-card card-hover cursor-pointer overflow-hidden">
      
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Photo or placeholder */}
      <div className="relative h-44 bg-muted/50 overflow-hidden hidden">
        {plant.photo_url ?
        <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :

        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-float">
              <Sprout className="w-8 h-8 text-primary/60" />
            </div>
            <p className="text-xs text-muted-foreground">Sem foto</p>
          </div>
        }
        <div className="absolute top-3 left-3">
          <StageBadge stage={plant.stage} />
        </div>
        {plant.medium &&
        <div className="absolute top-3 right-3 text-lg">{mediumIcon[plant.medium]}</div>
        }
      </div>

      {/* Info */}
      


























      
    </div>);

}