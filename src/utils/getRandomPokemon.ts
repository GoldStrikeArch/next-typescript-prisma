const MAX_POKEDEX_ID = 493;

type PokemonIndex = number;
type GetRandomPokemon = (notThisOne?: PokemonIndex) => PokemonIndex;

export const getRandomPokemon: GetRandomPokemon = (notThisOne) => {
  const randomPokedex = Math.floor(Math.random() * MAX_POKEDEX_ID) + 1;

  if (randomPokedex !== notThisOne) return randomPokedex;

  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
  const first = getRandomPokemon();
  const second = getRandomPokemon(first);

  return [first, second];
};
