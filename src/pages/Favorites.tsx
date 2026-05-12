import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Search, LayoutGrid, List, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { usePokemonBatch } from '@/hooks/use-pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonCardSkeleton } from '@/components/PokemonCardSkeleton';
import { cn } from '@/lib/utils';

export default function Favorites() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { data: pokemonList, isLoading } = usePokemonBatch(favorites);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-destructive fill-destructive" />
              Favorites
            </h1>
            <p className="text-muted-foreground mt-1">{favorites.length} Pokémon saved</p>
          </div>
          <div className="flex gap-1 glass rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon icon="mdi:heart-broken" className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No favorites yet</p>
            <p className="text-sm mt-1">Click the heart icon on any Pokémon to add it here</p>
          </div>
        ) : isLoading ? (
          <div className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'flex flex-col gap-2'
          )}>
            {favorites.map(id => <PokemonCardSkeleton key={id} view={view} />)}
          </div>
        ) : (
          <div className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'flex flex-col gap-2'
          )}>
            {pokemonList?.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavorite={isFavorite(pokemon.id)}
                onToggleFavorite={toggleFavorite}
                view={view}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
