import {
  pokemonsOptions,
  usePokemonsSuspense,
} from "~/api/queries/usePokemons";
import { queryClient } from "~/api/queryClient";

export async function clientLoader() {
  await queryClient.ensureQueryData(pokemonsOptions);

  return {};
}

export default function PokemonsPage() {
  const pokemons = usePokemonsSuspense();

  return (
    <main>
      <h1>Pokemons page</h1>
      <p>Here you can see all pokemons</p>
      <ul className="flex flex-col gap-2">
        {pokemons.data.results.map((pokemon, index) => (
          <li key={pokemon.name} className="p-2 border-yellow-400 border">
            <img
              alt={pokemon.name}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
            />
            {pokemon.name}
          </li>
        ))}
      </ul>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <div>
      <h1 className="text-center text-2xl mt-10">
        Sorry we couldnt get the pokemons this time!
      </h1>
    </div>
  );
}
