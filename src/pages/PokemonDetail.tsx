import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { usePokemonDetail, usePokemonSpecies, useEvolutionChain } from '@/hooks/use-pokemon';
import { useFavorites } from '@/hooks/use-favorites';
import { TypeBadge } from '@/components/TypeBadge';
import { MovesList } from '@/components/MovesList';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { type PokemonType, TYPE_COLORS, TYPE_EFFECTIVENESS, TYPE_ICONS } from '@/lib/pokemon-types';
import { getPokemonImage, formatPokemonId, capitalize } from '@/lib/pokemon-api';
import type { EvolutionChainLink } from '@/lib/pokemon-api';
import { cn } from '@/lib/utils';

const STAT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
};

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);
  const { data: pokemon, isLoading } = usePokemonDetail(pokemonId);
  const { data: species } = usePokemonSpecies(pokemonId);
  const { data: evoChain } = useEvolutionChain(species?.evolution_chain?.url);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading || !pokemon) {
    return (
      <main className="container mx-auto px-4 py-6">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </main>
    );
  }

  const primaryType = pokemon.types[0].type.name as PokemonType;
  const image = getPokemonImage(pokemon);
  const flavorText = species?.flavor_text_entries
    ?.find(e => e.language.name === 'en')
    ?.flavor_text.replace(/\f|\n/g, ' ');
  const genus = species?.genera?.find(g => g.language.name === 'en')?.genus;

  const statsData = pokemon.stats.map((s, i) => ({
    name: STAT_LABELS[s.stat.name] || s.stat.name,
    value: s.base_stat,
    fill: STAT_COLORS[i],
  }));

  const typeWeaknesses = pokemon.types.flatMap(t => {
    const eff = TYPE_EFFECTIVENESS[t.type.name as PokemonType];
    return eff?.weak ?? [];
  });
  const typeResistances = pokemon.types.flatMap(t => {
    const eff = TYPE_EFFECTIVENESS[t.type.name as PokemonType];
    return eff?.resist ?? [];
  });
  const uniqueWeak = [...new Set(typeWeaknesses)].filter(w => !typeResistances.includes(w));
  const uniqueResist = [...new Set(typeResistances)].filter(r => !typeWeaknesses.includes(r));

  return (
    <main className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Hero */}
      <div
        className="glass-strong rounded-3xl p-8 mb-8 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{ background: `radial-gradient(circle at 70% 30%, hsl(${TYPE_COLORS[primaryType].hsl}), transparent 60%)` }}
        />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <img
            src={image}
            alt={pokemon.name}
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-float"
          />

          <div className="flex-1 text-center md:text-left">
            <p className="font-mono text-muted-foreground text-sm mb-1">{formatPokemonId(pokemon.id)}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{capitalize(pokemon.name)}</h1>
            {genus && <p className="text-muted-foreground mb-3">{genus}</p>}
            <div className="flex gap-2 justify-center md:justify-start mb-4">
              {pokemon.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name as PokemonType} size="md" />
              ))}
            </div>

            <div className="flex gap-6 justify-center md:justify-start text-sm text-muted-foreground mb-4">
              <span>Height: <strong className="text-foreground">{(pokemon.height / 10).toFixed(1)}m</strong></span>
              <span>Weight: <strong className="text-foreground">{(pokemon.weight / 10).toFixed(1)}kg</strong></span>
            </div>

            {flavorText && (
              <p className="text-muted-foreground italic max-w-md">{flavorText}</p>
            )}

            <Button
              onClick={() => toggleFavorite(pokemon.id)}
              variant={isFavorite(pokemon.id) ? 'destructive' : 'outline'}
              className="mt-4"
            >
              <Heart className={cn('w-4 h-4 mr-2', isFavorite(pokemon.id) && 'fill-current')} />
              {isFavorite(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Base Stats</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 255]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" width={40} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                {statsData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          Total: <strong>{pokemon.stats.reduce((a, s) => a + s.base_stat, 0)}</strong>
        </p>
      </section>

      {/* Abilities */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-3">Abilities</h2>
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map(a => (
            <span
              key={a.ability.name}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium',
                a.is_hidden ? 'bg-accent text-accent-foreground border border-border' : 'bg-secondary text-secondary-foreground'
              )}
            >
              {capitalize(a.ability.name)}
              {a.is_hidden && <span className="ml-1 text-xs opacity-60">(Hidden)</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Type Effectiveness */}
      <section className="glass rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-3">Type Effectiveness</h2>
        <div className="space-y-3">
          {uniqueWeak.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">Weak to:</p>
              <div className="flex flex-wrap gap-1.5">
                {uniqueWeak.map(t => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          )}
          {uniqueResist.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">Resistant to:</p>
              <div className="flex flex-wrap gap-1.5">
                {uniqueResist.map(t => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Moves */}
      {(pokemon as any).moves?.length > 0 && (
        <section className="glass rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Moves</h2>
          <MovesList moves={(pokemon as any).moves} />
        </section>
      )}

      {/* Evolution Chain */}
      {evoChain && (
        <section className="glass rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Evolution Chain</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <EvolutionNode chain={evoChain.chain} />
          </div>
        </section>
      )}
    </main>
  );
}

function EvolutionNode({ chain }: { chain: EvolutionChainLink }) {
  const speciesId = chain.species.url.match(/\/(\d+)\//)?.[1];

  return (
    <>
      <Link
        to={`/pokemon/${speciesId}`}
        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-accent transition-colors"
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`}
          alt={chain.species.name}
          className="w-20 h-20 object-contain"
        />
        <span className="text-sm font-medium">{capitalize(chain.species.name)}</span>
        {chain.evolution_details[0] && (
          <span className="text-xs text-muted-foreground">
            {chain.evolution_details[0].min_level
              ? `Lv. ${chain.evolution_details[0].min_level}`
              : chain.evolution_details[0].item
                ? capitalize(chain.evolution_details[0].item.name)
                : capitalize(chain.evolution_details[0].trigger.name)}
          </span>
        )}
      </Link>
      {chain.evolves_to.map(evo => (
        <span key={evo.species.name} className="flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <EvolutionNode chain={evo} />
        </span>
      ))}
    </>
  );
}
