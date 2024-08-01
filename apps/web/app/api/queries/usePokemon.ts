import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

type PokemonResponse = {
  id: number;
  name: string;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
    slot: number;
  }[];
};

export const pokemonOptions = (id: string) =>
  queryOptions({
    queryKey: ["pokemons", id],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.json() as Promise<PokemonResponse>;
    },
  });

export function usePokemon(id: string) {
  return useQuery(pokemonOptions(id));
}

export function usePokemonSuspense(id: string) {
  return useSuspenseQuery(pokemonOptions(id));
}
