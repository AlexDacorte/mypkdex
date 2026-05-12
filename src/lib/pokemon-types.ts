export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string; hsl: string }> = {
  normal:   { bg: 'bg-type-normal',   text: 'text-white', hsl: '48 12% 60%' },
  fire:     { bg: 'bg-type-fire',     text: 'text-white', hsl: '14 80% 55%' },
  water:    { bg: 'bg-type-water',    text: 'text-white', hsl: '222 70% 55%' },
  electric: { bg: 'bg-type-electric', text: 'text-black', hsl: '48 90% 55%' },
  grass:    { bg: 'bg-type-grass',    text: 'text-white', hsl: '100 55% 45%' },
  ice:      { bg: 'bg-type-ice',      text: 'text-black', hsl: '180 50% 65%' },
  fighting: { bg: 'bg-type-fighting', text: 'text-white', hsl: '2 65% 45%' },
  poison:   { bg: 'bg-type-poison',   text: 'text-white', hsl: '280 50% 45%' },
  ground:   { bg: 'bg-type-ground',   text: 'text-white', hsl: '40 55% 50%' },
  flying:   { bg: 'bg-type-flying',   text: 'text-white', hsl: '250 60% 70%' },
  psychic:  { bg: 'bg-type-psychic',  text: 'text-white', hsl: '340 70% 55%' },
  bug:      { bg: 'bg-type-bug',      text: 'text-white', hsl: '72 60% 40%' },
  rock:     { bg: 'bg-type-rock',     text: 'text-white', hsl: '45 40% 45%' },
  ghost:    { bg: 'bg-type-ghost',    text: 'text-white', hsl: '265 40% 40%' },
  dragon:   { bg: 'bg-type-dragon',   text: 'text-white', hsl: '250 70% 50%' },
  dark:     { bg: 'bg-type-dark',     text: 'text-white', hsl: '25 20% 30%' },
  steel:    { bg: 'bg-type-steel',    text: 'text-black', hsl: '210 15% 65%' },
  fairy:    { bg: 'bg-type-fairy',    text: 'text-black', hsl: '330 50% 70%' },
};

export const TYPE_ICONS: Record<PokemonType, string> = {
  normal:   'game-icons:plain-circle',
  fire:     'game-icons:fire',
  water:    'game-icons:drop',
  electric: 'game-icons:lightning-bolt',
  grass:    'game-icons:leaf',
  ice:      'game-icons:snowflake-1',
  fighting: 'game-icons:boxing-glove',
  poison:   'game-icons:poison-bottle',
  ground:   'game-icons:mountain-road',
  flying:   'game-icons:feather',
  psychic:  'game-icons:psychic-waves',
  bug:      'game-icons:butterfly',
  rock:     'game-icons:rock',
  ghost:    'game-icons:ghost',
  dragon:   'game-icons:dragon-head',
  dark:     'game-icons:moon',
  steel:    'game-icons:metal-bar',
  fairy:    'game-icons:fairy',
};

export const GENERATIONS = [
  { id: 1, name: 'Gen I', range: [1, 151] },
  { id: 2, name: 'Gen II', range: [152, 251] },
  { id: 3, name: 'Gen III', range: [252, 386] },
  { id: 4, name: 'Gen IV', range: [387, 493] },
  { id: 5, name: 'Gen V', range: [494, 649] },
  { id: 6, name: 'Gen VI', range: [650, 721] },
  { id: 7, name: 'Gen VII', range: [722, 809] },
  { id: 8, name: 'Gen VIII', range: [810, 905] },
  { id: 9, name: 'Gen IX', range: [906, 1025] },
] as const;

// Type effectiveness chart
export const TYPE_EFFECTIVENESS: Record<PokemonType, { weak: PokemonType[]; resist: PokemonType[]; immune: PokemonType[] }> = {
  normal:   { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire:     { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
  water:    { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
  grass:    { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
  ice:      { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
  poison:   { weak: ['ground', 'psychic'], resist: ['fighting', 'poison', 'bug', 'grass', 'fairy'], immune: [] },
  ground:   { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
  flying:   { weak: ['electric', 'ice', 'rock'], resist: ['fighting', 'bug', 'grass'], immune: ['ground'] },
  psychic:  { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
  bug:      { weak: ['fire', 'flying', 'rock'], resist: ['fighting', 'ground', 'grass'], immune: [] },
  rock:     { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
  ghost:    { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
  dragon:   { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
  dark:     { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
  steel:    { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
  fairy:    { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] },
};
