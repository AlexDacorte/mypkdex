import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchAbility,
  type Pokemon,
} from '@/lib/pokemon-api';

const PAGE_SIZE = 24;

export function usePokemonInfinite() {
  return useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: async ({ pageParam = 0 }) => {
      const list = await fetchPokemonList(pageParam, PAGE_SIZE);
      const pokemon = await Promise.all(
        list.results.map(p => fetchPokemon(p.name))
      );
      return { pokemon, count: list.count, nextOffset: pageParam + PAGE_SIZE };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextOffset < lastPage.count ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePokemonDetail(idOrName: number | string) {
  return useQuery({
    queryKey: ['pokemon', idOrName],
    queryFn: () => fetchPokemon(idOrName),
    staleTime: 1000 * 60 * 30,
  });
}

export function usePokemonSpecies(id: number) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    staleTime: 1000 * 60 * 30,
  });
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchEvolutionChain(url!),
    enabled: !!url,
    staleTime: 1000 * 60 * 30,
  });
}

export function useAbility(url: string) {
  return useQuery({
    queryKey: ['ability', url],
    queryFn: () => fetchAbility(url),
    staleTime: 1000 * 60 * 30,
  });
}

export function usePokemonBatch(ids: number[]) {
  return useQuery({
    queryKey: ['pokemon-batch', ids],
    queryFn: () => Promise.all(ids.map(id => fetchPokemon(id))),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 30,
  });
}
