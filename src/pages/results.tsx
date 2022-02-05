import type { GetStaticProps } from "next";
import type { FC } from "react";
import { prisma } from "@/backend/utils/prisma";
import Image from "next/image";

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

const calculatePercent = (x: number, y: number) => {
  if (x === 0) return 0;
  if (x + y === 0) return 0;
  return (x / x + y) * 100;
};

const Pokemon: FC<{ pokemon: PokemonQueryResult[number] }> = ({ pokemon }) => {
  return (
    <section className="flex items-center w-full max-w-2xl p-4 border">
      <Image src={pokemon.spriteUrl} width={64} height={64} layout="fixed" />
      <h1 className="ml-3 text 2xl">{pokemon.name}</h1>
      <p className="ml-auto ">
        {calculatePercent(pokemon._count.VoteFor, pokemon._count.VoteAgainst)}%
      </p>
    </section>
  );
};

const ResultsPage: FC<{
  pokemonList: PokemonQueryResult;
}> = ({ pokemonList }) => {
  console.log(pokemonList);
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="m-3 text-3xl">Results</h2>
      {pokemonList.map((pokemon) => (
        <Pokemon pokemon={pokemon} key={Math.random() * Date.now()} />
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  const DAY_IN_SECONDS = 60 * 60 * 24;
  return { props: { pokemonList: pokemonOrdered }, revalidate: DAY_IN_SECONDS };
};

export default ResultsPage;
