import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sleep } from "~/utils/sleep";
import { pokemonsOptions } from "../queries/usePokemons";
import { pokemonOptions } from "../queries/usePokemon";

export async function updatePokemon(
  _id: string,
  _options: { data: { name: string; weight: number } }
) {
  await sleep(1000);
  return { id: 1, name: "bulbasaur", weight: 69, abilities: [] };
}

export async function invalidatePokemonQueries(
  queryClient: QueryClient,
  id?: string
) {
  await queryClient.invalidateQueries(pokemonsOptions);

  if (id) {
    await queryClient.invalidateQueries(pokemonOptions(id));
  }
}

export function useUpdatePokemon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updatePokemon"],
    mutationFn: ({
      id,
      options,
    }: {
      id: string;
      options: { data: { name: string; weight: number } };
    }) => updatePokemon(id, options),
    onSettled: (_data, _error, variables) => {
      invalidatePokemonQueries(queryClient, variables.id);
    },
  });
}
