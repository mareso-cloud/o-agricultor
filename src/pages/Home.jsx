import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Header from '@/components/layout/Header';
import PlantCard from '@/components/plants/PlantCard';
import EmptyState from '@/components/plants/EmptyState';
import StatsBar from '@/components/plants/StatsBar';
import PlantForm from '@/components/plants/PlantForm';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Plant.list('-created_date').then(data => {
      setPlants(data);
      setLoading(false);
    });
  }, []);

  const filtered = plants.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.strain || '').toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || p.stage === filterStage;
    return matchSearch && matchStage && p.status !== 'perdida';
  });

  const activePlants = plants.filter(p => p.status === 'ativa');

  return (
    <div className="min-h-screen bg-background">
      <Header onNewPlant={() => setShowForm(true)} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : plants.length === 0 ? (
          <EmptyState onNewPlant={() => setShowForm(true)} />
        ) : (
          <>
            {/* Stats */}
            <StatsBar plants={activePlants} />

            {/* Search & Filter */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar planta..."
                  className="w-full pl-9 pr-4 h-10 bg-card border border-border/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40"
                />
              </div>
              <div className="flex gap-1.5">
                {['all', 'germinacao', 'vegetativo', 'floracao', 'colheita'].map(stage => (
                  <button
                    key={stage}
                    onClick={() => setFilterStage(stage)}
                    className={`h-10 px-3 rounded-xl text-xs font-medium border transition-all ${filterStage === stage ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border/50 text-muted-foreground hover:border-border bg-card'}`}
                  >
                    {stage === 'all' ? 'Todas' : stage === 'germinacao' ? '🌱' : stage === 'vegetativo' ? '🌿' : stage === 'floracao' ? '🌸' : '🌾'}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p>Nenhuma planta encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {filtered.map(plant => (
                  <PlantCard key={plant.id} plant={plant} onClick={() => navigate(`/plant/${plant.id}`)} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showForm && (
        <PlantForm
          onClose={() => setShowForm(false)}
          onSave={(plant) => {
            setPlants(prev => [plant, ...prev]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}