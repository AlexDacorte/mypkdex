import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchPokemonList } from '@/lib/pokemon-api';

export function usePokemonSearch(query: string) {
  const { data: allPokemon } = useQuery({
    queryKey: ['pokemon-names'],
    queryFn: async () => {
      const res = await fetchPokemonList(0, 1025);
      return res.results.map((p, i) => ({
        name: p.name,
        id: i + 1,
      }));
    },
    staleTime: Infinity,
  });

  const results = useMemo(() => {
    if (!query.trim() || !allPokemon) return [];
    const q = query.trim().toLowerCase();

    // Exact number match → single result
    const num = Number(q);
    if (num && num >= 1 && num <= 1025) {
      return [allPokemon[num - 1]];
    }

    // Exact name match → single result
    const exact = allPokemon.find(p => p.name === q);
    if (exact) return [exact];

    // Partial match
    return allPokemon
      .filter(p => p.name.includes(q))
      .slice(0, 10);
  }, [query, allPokemon]);

  return results;
}
