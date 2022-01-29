import * as trpc from "@trpc/server";

import { z } from "zod";
import { prisma } from "@/backend/utils/prisma";

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
  });

// export type definition of API
export type AppRouter = typeof appRouter;
