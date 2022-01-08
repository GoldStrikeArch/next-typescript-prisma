import * as trpc from "@trpc/server";
import { PokemonClient } from "pokenode-ts";

import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";
import { resolve } from "path/posix";

let apiCount = 0;
export const appRouter = trpc
  .router()
  .query("get-pokemon", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const pokeApiConnection = new PokemonClient();

      console.log(`api count is ${apiCount++}`);

      const pokemon = await pokeApiConnection.getPokemonById(input.id);

      return {
        name: pokemon.name,
        sprite: pokemon.sprites.front_default,
      };
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDB = await prisma.vote.create({
        data: {
          ...input,
        },
      });

      return {
        success: true,
        vote: voteInDB,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
