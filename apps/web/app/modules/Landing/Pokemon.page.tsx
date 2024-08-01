import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import {
  invalidatePokemonQueries,
  updatePokemon,
} from "~/api/mutations/useUpdatePokemon";
import { pokemonOptions, usePokemonSuspense } from "~/api/queries/usePokemon";
import { queryClient } from "~/api/queryClient";

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  if (!params.id) throw new Error("No id provided");

  if (params.id === "manual-throw") {
    try {
      await queryClient.ensureQueryData(pokemonOptions(params.id));
    } catch (error) {
      throw new Response("Not found", { status: 404 });
    }
  }

  await queryClient.ensureQueryData(pokemonOptions(params.id));

  return {};
}

export async function clientAction({
  request,
  params,
}: ClientActionFunctionArgs) {
  if (!params.id) throw new Error("No id provided");
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const weight = Number(formData.get("weight"));

  await updatePokemon(params.id, { data: { name, weight } });
  await invalidatePokemonQueries(queryClient, params.id);

  return {};
}

export default function PokemonPage() {
  const params = useParams<{ id: string }>();
  const { data: pokemon, isFetching } = usePokemonSuspense(params.id!);
  const [editMode, setEditMode] = useState(false);

  return (
    <main>
      <header>
        <h1>{pokemon.name} page</h1>
        <h2>{isFetching && "Refetching in bg..."}</h2>
        <button
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          edit
        </button>
      </header>
      <p>Here you can see the pokemon details</p>
      <img
        alt={pokemon.name}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
      />
      <p>Weight: {pokemon.weight}</p>

      {editMode && (
        <Form method="POST">
          <label>
            Name:
            <input
              className="text-black"
              type="text"
              name="name"
              defaultValue={pokemon.name}
            />
          </label>
          <label>
            Weight:
            <input
              className="text-black"
              type="number"
              name="weight"
              defaultValue={pokemon.weight}
            />
          </label>
          <button type="submit">Save</button>
        </Form>
      )}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div>
        <h1>Pokemon not found!</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong</h1>
    </div>
  );
}
