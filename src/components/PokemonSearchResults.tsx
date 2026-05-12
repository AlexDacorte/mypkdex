import { capitalize, formatPokemonId } from '@/lib/pokemon-api';

interface SearchResult {
  name: string;
  id: number;
}

interface PokemonSearchResultsProps {
  results: SearchResult[];
  onSelect: (id: number) => void;
  visible: boolean;
}

export function PokemonSearchResults({ results, onSelect, visible }: PokemonSearchResultsProps) {
  if (!visible || results.length === 0) return null;

  return (
    <div className="glass rounded-xl max-h-48 overflow-y-auto mb-3">
      {results.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors text-sm"
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
            alt={p.name}
            className="w-8 h-8 object-contain"
          />
          <span className="font-mono text-xs text-muted-foreground w-14">{formatPokemonId(p.id)}</span>
          <span className="font-medium">{capitalize(p.name)}</span>
        </button>
      ))}
    </div>
  );
}
