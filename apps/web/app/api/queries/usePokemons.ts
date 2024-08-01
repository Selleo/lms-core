import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

type PokemonsResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

export const pokemonsOptions = queryOptions({
  queryKey: ["pokemons", "list"],
  queryFn: async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon");
    return response.json() as Promise<PokemonsResponse>;
  },
});

export function usePokemons() {
  return useQuery(pokemonsOptions);
}

export function usePokemonsSuspense() {
  return useSuspenseQuery(pokemonsOptions);
}
