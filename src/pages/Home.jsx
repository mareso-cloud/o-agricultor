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
    base44.entities.Plant.list('-created_date').then((data) => {
      setPlants(data);
      setLoading(false);
    });
  }, []);

  const filtered = plants.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.strain || '').toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || p.stage === filterStage;
    return matchSearch && matchStage && p.status !== 'perdida';
  });

  const activePlants = plants.filter((p) => p.status === 'ativa');

  return (
    <div className="min-h-screen bg-background">
      <Header onNewPlant={() => setShowForm(true)} />

      

















































      

      {showForm &&
      <PlantForm
        onClose={() => setShowForm(false)}
        onSave={(plant) => {
          setPlants((prev) => [plant, ...prev]);
          setShowForm(false);
        }} />

      }
    </div>);

}