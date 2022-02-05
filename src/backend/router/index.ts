import * as trpc from "@trpc/server";

import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

import { PokemonClient } from "pokenode-ts";

const populateDb = async () => {
  const api = new PokemonClient();

  const allPokemons = await api.listPokemons(0, 493);

  const formatedPokemons = allPokemons.results.map((p, index) => ({
    id: index + 1,
    name: (p as { name: string }).name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`,
  }));

  const creation = await prisma.pokemon.createMany({
    data: formatedPokemons,
  });

  console.log("Creation?", creation);
};

let apiCount = 0;
export const appRouter = trpc
  .router()
  .query("get-pokemon", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      console.log(`api count is ${apiCount++}`);

      const pokemon = await prisma.pokemon.findFirst({
        where: {
          id: input.id,
        },
      });

      return pokemon;
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
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });

      return {
        success: true,
        vote: voteInDB,
      };
    },
  })
  .mutation("populate-db", {
    async resolve() {
      await populateDb();
      return {
        success: true,
        text: "we did it",
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
