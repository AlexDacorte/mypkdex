import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { type Pokemon, getPokemonImage, formatPokemonId, capitalize } from '@/lib/pokemon-api';
import { type PokemonType, TYPE_COLORS } from '@/lib/pokemon-types';
import { TypeBadge } from './TypeBadge';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  view: 'grid' | 'list';
}

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite, view }: PokemonCardProps) {
  const primaryType = pokemon.types[0].type.name as PokemonType;
  const image = getPokemonImage(pokemon);

  if (view === 'list') {
    return (
      <Link
        to={`/pokemon/${pokemon.id}`}
        className="pokemon-card flex items-center gap-4 p-3 px-5 group"
      >
        <span className="font-mono text-sm text-muted-foreground w-16">{formatPokemonId(pokemon.id)}</span>
        <img src={image} alt={pokemon.name} className="w-10 h-10 object-contain" loading="lazy" />
        <span className="font-semibold flex-1">{capitalize(pokemon.name)}</span>
        <div className="flex gap-1.5">
          {pokemon.types.map(t => (
            <TypeBadge key={t.type.name} type={t.type.name as PokemonType} />
          ))}
        </div>
        <button
          onClick={e => { e.preventDefault(); onToggleFavorite(pokemon.id); }}
          className="p-2 rounded-full hover:bg-accent transition-colors"
        >
          <Heart className={cn('w-4 h-4', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
        </button>
      </Link>
    );
  }

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card group relative flex flex-col items-center p-5 pt-12 animate-fade-in"
      style={{ animationDelay: `${(pokemon.id % 24) * 30}ms` }}
    >
      <button
        onClick={e => { e.preventDefault(); onToggleFavorite(pokemon.id); }}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-accent transition-colors z-10"
      >
        <Heart className={cn('w-4 h-4', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
      </button>

      <span className="absolute top-3 left-4 font-mono text-sm text-muted-foreground/50 font-bold">
        {formatPokemonId(pokemon.id)}
      </span>

      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, hsl(${TYPE_COLORS[primaryType].hsl}), transparent 70%)` }}
      />

      <img
        src={image}
        alt={pokemon.name}
        className="w-24 h-24 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-[1]"
        loading="lazy"
      />

      <h3 className="font-semibold mt-3 text-card-foreground">{capitalize(pokemon.name)}</h3>

      <div className="flex gap-1.5 mt-2">
        {pokemon.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name as PokemonType} />
        ))}
      </div>
    </Link>
  );
}
