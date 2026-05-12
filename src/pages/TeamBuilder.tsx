import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { X, Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TypeBadge } from '@/components/TypeBadge';
import { PokemonSearchResults } from '@/components/PokemonSearchResults';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeam } from '@/hooks/use-team';
import { usePokemonBatch, usePokemonDetail } from '@/hooks/use-pokemon';
import { usePokemonSearch } from '@/hooks/use-pokemon-search';
import { getPokemonImage, formatPokemonId, capitalize, type Pokemon } from '@/lib/pokemon-api';
import { type PokemonType, TYPE_COLORS } from '@/lib/pokemon-types';
import { cn } from '@/lib/utils';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF',
  'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'SPD',
};

export default function TeamBuilder() {
  const { team, addToTeam, removeFromTeam, clearTeam, isFull } = useTeam();
  const { data: teamPokemon, isLoading } = usePokemonBatch(team);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchId, setSearchId] = useState<number | string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { data: searchResult, isLoading: searchLoading } = usePokemonDetail(searchId ?? 0);
  const searchResults = usePokemonSearch(searchQuery);

  const handleSearch = () => {
    if (searchResults.length === 1) {
      setSearchId(searchResults[0].id);
      setShowResults(false);
    } else if (searchResults.length > 1) {
      setShowResults(true);
    } else {
      const val = searchQuery.trim().toLowerCase();
      if (!val) return;
      const num = Number(val);
      setSearchId(num || val);
    }
  };

  const handleSelectResult = (id: number) => {
    setSearchId(id);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleAdd = (id: number) => {
    addToTeam(id);
    setSearchId(null);
    setSearchQuery('');
  };

  const addRandom = () => {
    const id = Math.floor(Math.random() * 1025) + 1;
    if (!team.includes(id)) {
      addToTeam(id);
    } else {
      addRandom();
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Icon icon="mdi:account-group" className="w-7 h-7 text-primary" />
            Team Builder
          </h1>
          {team.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearTeam} className="text-muted-foreground">
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mb-8">{team.length}/6 Pokémon in your team</p>

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {isLoading
            ? team.map((_, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex flex-col items-center">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="w-16 h-4 mt-2" />
                </div>
              ))
            : teamPokemon?.map(pokemon => (
                <TeamSlot
                  key={pokemon.id}
                  pokemon={pokemon}
                  onRemove={() => removeFromTeam(pokemon.id)}
                />
              ))}

          {/* Empty slots */}
          {Array.from({ length: 6 - team.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="glass rounded-2xl p-4 flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-border/50"
            >
              <Icon icon="mdi:pokeball" className="w-8 h-8 text-muted-foreground/20" />
              <span className="text-xs text-muted-foreground/40 mt-2">Empty</span>
            </div>
          ))}
        </div>

        {/* Add Pokemon */}
        {!isFull && (
          <div className="glass rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Add a Pokémon</h2>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Search by name or number..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowResults(false); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="border-0 bg-secondary"
              />
              <Button onClick={handleSearch} size="icon" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
              <Button onClick={addRandom} variant="outline" className="shrink-0">
                <Icon icon="mdi:dice-5" className="w-4 h-4 mr-1" /> Random
              </Button>
            </div>

            <PokemonSearchResults
              results={searchResults}
              onSelect={handleSelectResult}
              visible={showResults}
            />

            {searchLoading && searchId && (
              <div className="flex items-center gap-4 p-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-32 h-5" />
              </div>
            )}

            {searchResult && searchId && !searchLoading && (
              <div className="flex items-center gap-4 p-3 glass rounded-xl">
                <img
                  src={getPokemonImage(searchResult)}
                  alt={searchResult.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <p className="font-mono text-xs text-muted-foreground">{formatPokemonId(searchResult.id)}</p>
                  <p className="font-bold">{capitalize(searchResult.name)}</p>
                  <div className="flex gap-1 mt-1">
                    {searchResult.types.map(t => (
                      <TypeBadge key={t.type.name} type={t.type.name as PokemonType} />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => handleAdd(searchResult.id)}
                  disabled={team.includes(searchResult.id)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {team.includes(searchResult.id) ? 'In Team' : 'Add'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Team Stats Summary */}
        {teamPokemon && teamPokemon.length > 0 && (
          <section className="glass rounded-2xl p-6 mt-6">
            <h2 className="font-bold text-lg mb-4">Team Overview</h2>

            {/* Type coverage */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Type Coverage</p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(teamPokemon.flatMap(p => p.types.map(t => t.type.name)))].map(type => (
                  <TypeBadge key={type} type={type as PokemonType} />
                ))}
              </div>
            </div>

            {/* Average stats */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Average Base Stats</p>
              <div className="space-y-2">
                {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((statName, i) => {
                  const avg = Math.round(
                    teamPokemon.reduce((sum, p) => sum + (p.stats.find(s => s.stat.name === statName)?.base_stat ?? 0), 0) / teamPokemon.length
                  );
                  const colors = ['bg-type-fire', 'bg-type-fighting', 'bg-type-electric', 'bg-type-water', 'bg-type-grass', 'bg-type-psychic'];
                  return (
                    <div key={statName} className="flex items-center gap-3">
                      <span className="text-xs font-mono w-8 text-muted-foreground">{STAT_LABELS[statName]}</span>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-700', colors[i])}
                          style={{ width: `${(avg / 255) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono w-8 text-right">{avg}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function TeamSlot({ pokemon, onRemove }: { pokemon: Pokemon; onRemove: () => void }) {
  const primaryType = pokemon.types[0].type.name as PokemonType;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col items-center relative group">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>

      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, hsl(${TYPE_COLORS[primaryType].hsl}), transparent 70%)` }}
      />

      <Link to={`/pokemon/${pokemon.id}`}>
        <img
          src={getPokemonImage(pokemon)}
          alt={pokemon.name}
          className="w-20 h-20 object-contain drop-shadow-lg hover:scale-110 transition-transform relative z-[1]"
        />
      </Link>
      <p className="font-mono text-[10px] text-muted-foreground mt-1">{formatPokemonId(pokemon.id)}</p>
      <p className="text-sm font-semibold">{capitalize(pokemon.name)}</p>
      <div className="flex gap-1 mt-1">
        {pokemon.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name as PokemonType} showLabel={false} />
        ))}
      </div>
    </div>
  );
}
