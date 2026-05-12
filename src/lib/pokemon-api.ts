const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

export interface PokemonTypeSlot {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonSprites {
  front_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
}

export interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string }; version: { name: string } }[];
  evolution_chain: { url: string };
  genera: { genus: string; language: { name: string } }[];
}

export interface EvolutionDetail {
  min_level: number | null;
  trigger: { name: string };
  item: { name: string } | null;
}

export interface EvolutionChainLink {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

export interface AbilityDetail {
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  name: string;
}

export async function fetchPokemonList(offset: number, limit: number): Promise<{ results: PokemonListItem[]; count: number }> {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  return res.json();
}

export async function fetchPokemon(idOrName: number | string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon: ${idOrName}`);
  return res.json();
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch species: ${id}`);
  return res.json();
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch evolution chain');
  return res.json();
}

export async function fetchAbility(url: string): Promise<AbilityDetail> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ability');
  return res.json();
}

export function getPokemonImage(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.front_default ||
    '/placeholder.svg'
  );
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export function capitalize(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
