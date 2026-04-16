import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Plus, Leaf, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StagesBadge from '@/components/StagesBadge';
import PlantFormModal from '@/components/PlantFormModal';
import { differenceInDays } from 'date-fns';

export default function Plants() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: () => base44.entities.Plant.list('-created_date'),
  });

  const filtered = plants.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.strain?.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'all' || p.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-playfair text-3xl font-bold">
          Minhas <span className="gradient-text">Plantas</span>
        </h1>
        <Button onClick={() => setShowForm(true)} className="bg-primary gap-2 glow-green-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Planta</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar planta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-44 bg-card border-border">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos estágios</SelectItem>
            <SelectItem value="germinação">Germinação</SelectItem>
            <SelectItem value="muda">Muda</SelectItem>
            <SelectItem value="vegetativo">Vegetativo</SelectItem>
            <SelectItem value="floração">Floração</SelectItem>
            <SelectItem value="colheita">Colheita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-playfair text-xl font-semibold mb-2">Nenhuma planta encontrada</h3>
          <p className="text-sm text-muted-foreground mb-5">
            {search || stageFilter !== 'all' ? 'Tente outros filtros' : 'Comece adicionando sua primeira planta'}
          </p>
          {!search && stageFilter === 'all' && (
            <Button onClick={() => setShowForm(true)} className="bg-primary gap-2 glow-green-sm">
              <Plus className="w-4 h-4" /> Nova Planta
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      {showForm && <PlantFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}

function PlantCard({ plant }) {
  const days = plant.start_date ? differenceInDays(new Date(), new Date(plant.start_date)) : null;

  return (
    <Link to={`/plants/${plant.id}`}>
      <div className="rounded-2xl border border-border bg-card overflow-hidden card-hover">
        <div className="h-36 bg-accent flex items-center justify-center relative">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.name} className="w-full h-full object-cover" />
          ) : (
            <Leaf className="w-12 h-12 text-primary/40" />
          )}
          <div className="absolute top-3 right-3">
            <StagesBadge stage={plant.stage} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{plant.name}</h3>
          {plant.strain && <p className="text-sm text-muted-foreground truncate">{plant.strain}</p>}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>{plant.medium || 'terra'}</span>
            {days !== null && <span>{days} dias</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}