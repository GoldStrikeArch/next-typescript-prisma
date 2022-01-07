import Button from "@/components/shared/Button";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from "next";
import { useEffect, useMemo, useState } from "react";

let renderCount = 0;

const Home: NextPage = ({
  pokemonPairIDs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(`renderCount is ${renderCount++}`);
  const [first, second] = pokemonPairIDs as number[];

  const [pokemonPair, setPokemonPair] = useState([first, second]);

  const firstPokemonQueryResult = trpc.useQuery([
    "get-pokemon",
    { id: pokemonPair[0] },
  ]);
  const secondPokemonQueryResult = trpc.useQuery([
    "get-pokemon",
    { id: pokemonPair[1] },
  ]);

  if (firstPokemonQueryResult.isLoading || secondPokemonQueryResult.isLoading)
    return null;

  const voteForRoundest = (selected: number) => {};

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-2xl text-center">Which pokemon is rounder?</h1>
      <section className="flex items-center justify-between max-w-2xl p-8 mt-4 border rounded">
        <div className="flex flex-col items-center justify-center w-64">
          <img
            className="w-full"
            src={firstPokemonQueryResult.data?.sprite ?? undefined}
          />
          <h1 className="block text-2xl text-center capitalize mt-[-2rem]">
            {firstPokemonQueryResult.data?.name}
          </h1>
          <Button style={{ marginTop: "1rem" }}>This one</Button>
        </div>
        <div>VS</div>
        <div className="flex flex-col items-center justify-center w-64">
          <img
            className="w-full"
            src={secondPokemonQueryResult.data?.sprite ?? undefined}
          />
          <h1 className="block text-2xl text-center capitalize mt-[-2rem]">
            {secondPokemonQueryResult.data?.name}
          </h1>
          <Button style={{ marginTop: "1rem" }}>This one</Button>
        </div>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [first, second] = getOptionsForVote();

  return {
    props: {
      pokemonPairIDs: [first, second],
    },
  };
};

export default Home;
