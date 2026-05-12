import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Search, X } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TypeBadge } from '@/components/TypeBadge';
import { usePokemonDetail } from '@/hooks/use-pokemon';
import { usePokemonSearch } from '@/hooks/use-pokemon-search';
import { PokemonSearchResults } from '@/components/PokemonSearchResults';
import { getPokemonImage, formatPokemonId, capitalize, type Pokemon } from '@/lib/pokemon-api';
import { type PokemonType, TYPE_COLORS } from '@/lib/pokemon-types';
import { Skeleton } from '@/components/ui/skeleton';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'SPD',
};

export default function Compare() {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [id1, setId1] = useState<number | string | null>(null);
  const [id2, setId2] = useState<number | string | null>(null);

  const { data: p1, isLoading: l1 } = usePokemonDetail(id1 ?? 0);
  const { data: p2, isLoading: l2 } = usePokemonDetail(id2 ?? 0);

  const handleSearch = (slot: 1 | 2) => {
    const val = slot === 1 ? search1 : search2;
    const parsed = val.trim().toLowerCase();
    if (!parsed) return;
    const num = Number(parsed);
    if (slot === 1) setId1(num || parsed);
    else setId2(num || parsed);
  };

  const handleSelect = (slot: 1 | 2, id: number) => {
    if (slot === 1) { setId1(id); setSearch1(''); }
    else { setId2(id); setSearch2(''); }
  };

  const chartData = useMemo(() => {
    if (!p1 || !p2) return [];
    return p1.stats.map((s, i) => ({
      name: STAT_LABELS[s.stat.name] || s.stat.name,
      [capitalize(p1.name)]: s.base_stat,
      [capitalize(p2.name)]: p2.stats[i].base_stat,
    }));
  }, [p1, p2]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Icon icon="mdi:scale-balance" className="w-7 h-7 text-primary" />
          Compare
        </h1>
        <p className="text-muted-foreground mb-8">Search by name or number to compare two Pokémon</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CompareSlot
            search={search1}
            setSearch={setSearch1}
            onSearch={() => handleSearch(1)}
            onSelect={(id) => handleSelect(1, id)}
            pokemon={id1 ? p1 : undefined}
            loading={!!id1 && l1}
            onClear={() => { setId1(null); setSearch1(''); }}
            label="Pokémon 1"
          />
          <CompareSlot
            search={search2}
            setSearch={setSearch2}
            onSearch={() => handleSearch(2)}
            onSelect={(id) => handleSelect(2, id)}
            pokemon={id2 ? p2 : undefined}
            loading={!!id2 && l2}
            onClear={() => { setId2(null); setSearch2(''); }}
            label="Pokémon 2"
          />
        </div>

        {p1 && p2 && (
          <section className="glass rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Stats Comparison</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 255]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }}
                  />
                  <Legend />
                  <Bar
                    dataKey={capitalize(p1.name)}
                    fill={`hsl(${TYPE_COLORS[p1.types[0].type.name as PokemonType].hsl})`}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey={capitalize(p2.name)}
                    fill={`hsl(${TYPE_COLORS[p2.types[0].type.name as PokemonType].hsl})`}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick compare table */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="text-right font-medium">{capitalize(p1.name)}</div>
              <div className="text-center text-muted-foreground">vs</div>
              <div className="font-medium">{capitalize(p2.name)}</div>

              <div className="text-right">{(p1.height / 10).toFixed(1)}m</div>
              <div className="text-center text-muted-foreground">Height</div>
              <div>{(p2.height / 10).toFixed(1)}m</div>

              <div className="text-right">{(p1.weight / 10).toFixed(1)}kg</div>
              <div className="text-center text-muted-foreground">Weight</div>
              <div>{(p2.weight / 10).toFixed(1)}kg</div>

              <div className="text-right">{p1.stats.reduce((a, s) => a + s.base_stat, 0)}</div>
              <div className="text-center text-muted-foreground">Total Stats</div>
              <div>{p2.stats.reduce((a, s) => a + s.base_stat, 0)}</div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function CompareSlot({
  search, setSearch, onSearch, onSelect, pokemon, loading, onClear, label,
}: {
  search: string;
  setSearch: (s: string) => void;
  onSearch: () => void;
  onSelect: (id: number) => void;
  pokemon?: Pokemon;
  loading: boolean;
  onClear: () => void;
  label: string;
}) {
  const [showResults, setShowResults] = useState(false);
  const searchResults = usePokemonSearch(search);

  const handleSearchClick = () => {
    if (searchResults.length === 1) {
      onSelect(searchResults[0].id);
      setShowResults(false);
    } else if (searchResults.length > 1) {
      setShowResults(true);
    } else {
      onSearch();
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-muted-foreground mb-3">{label}</p>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Name or number..."
          value={search}
          onChange={e => { setSearch(e.target.value); setShowResults(false); }}
          onKeyDown={e => { if (e.key === 'Enter') handleSearchClick(); }}
          className="border-0 bg-secondary"
        />
        <Button onClick={handleSearchClick} size="icon" variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <PokemonSearchResults
        results={searchResults}
        onSelect={(id) => { onSelect(id); setShowResults(false); }}
        visible={showResults}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-32 h-5" />
        </div>
      ) : pokemon ? (
        <div className="flex flex-col items-center relative">
          <button onClick={onClear} className="absolute top-0 right-0 p-1 rounded-full hover:bg-accent">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <img
            src={getPokemonImage(pokemon)}
            alt={pokemon.name}
            className="w-28 h-28 object-contain drop-shadow-lg"
          />
          <p className="font-mono text-xs text-muted-foreground mt-2">{formatPokemonId(pokemon.id)}</p>
          <h3 className="font-bold text-lg">{capitalize(pokemon.name)}</h3>
          <div className="flex gap-1.5 mt-2">
            {pokemon.types.map(t => (
              <TypeBadge key={t.type.name} type={t.type.name as PokemonType} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-muted-foreground">
          <Icon icon="mdi:pokeball" className="w-12 h-12 opacity-20 mb-2" />
          <p className="text-sm">Search for a Pokémon</p>
        </div>
      )}
    </div>
  );
}
