import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonCardSkeleton } from '@/components/PokemonCardSkeleton';
import { TypeBadge } from '@/components/TypeBadge';
import { POKEMON_TYPES, GENERATIONS, type PokemonType } from '@/lib/pokemon-types';
import { usePokemonInfinite } from '@/hooks/use-pokemon';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

export default function Index() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedGen, setSelectedGen] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePokemonInfinite();
  const { isFavorite, toggleFavorite } = useFavorites();

  const allPokemon = useMemo(
    () => data?.pages.flatMap(p => p.pokemon) ?? [],
    [data]
  );

  const filtered = useMemo(() => {
    let result = allPokemon;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.includes(q) || String(p.id).includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(p =>
        p.types.some(t => selectedTypes.includes(t.type.name as PokemonType))
      );
    }

    if (selectedGen !== null) {
      const gen = GENERATIONS.find(g => g.id === selectedGen);
      if (gen) {
        result = result.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1]);
      }
    }

    return result;
  }, [allPokemon, search, selectedTypes, selectedGen]);

  const toggleType = (type: PokemonType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Infinite scroll
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Pokédex
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the world of Pokémon
          </p>
        </div>

        {/* Search & View Toggle */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 glass border-0"
            />
          </div>
          <div className="flex gap-1 glass rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Generation Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedGen(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              selectedGen === null ? 'bg-primary text-primary-foreground' : 'glass text-muted-foreground hover:text-foreground'
            )}
          >
            All Gens
          </button>
          {GENERATIONS.map(gen => (
            <button
              key={gen.id}
              onClick={() => setSelectedGen(selectedGen === gen.id ? null : gen.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                selectedGen === gen.id ? 'bg-primary text-primary-foreground' : 'glass text-muted-foreground hover:text-foreground'
              )}
            >
              {gen.name}
            </button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {POKEMON_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'transition-all duration-200',
                selectedTypes.includes(type) ? 'scale-110 ring-2 ring-foreground/20 rounded-full' : 'opacity-70 hover:opacity-100'
              )}
            >
              <TypeBadge type={type} size="sm" />
            </button>
          ))}
        </div>

        {/* Pokemon Grid/List */}
        {isLoading ? (
          <div className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'flex flex-col gap-2'
          )}>
            {Array.from({ length: 24 }).map((_, i) => (
              <PokemonCardSkeleton key={i} view={view} />
            ))}
          </div>
        ) : (
          <>
            <div className={cn(
              view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
                : 'flex flex-col gap-2'
            )}>
              {filtered.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isFavorite={isFavorite(pokemon.id)}
                  onToggleFavorite={toggleFavorite}
                  view={view}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <Icon icon="mdi:pokeball" className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No Pokémon found</p>
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="h-10" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-8">
                <Icon icon="mdi:pokeball" className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
