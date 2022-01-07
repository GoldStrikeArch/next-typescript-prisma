import * as trpc from "@trpc/server";
import { PokemonClient } from "pokenode-ts";

import { z } from "zod";

let apiCount = 0;
export const appRouter = trpc.router().query("get-pokemon", {
  input: z.object({ id: z.number() }),
  async resolve({ input }) {
    const api = new PokemonClient();

    console.log(`api count is ${apiCount++}`);

    const pokemon = await api.getPokemonById(input.id);

    return {
      name: pokemon.name,
      sprite: pokemon.sprites.front_default,
    };
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
