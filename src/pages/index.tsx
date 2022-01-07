import Button from "@/components/shared/Button";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from "next";
import { useEffect, useMemo, useState, FC } from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

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

  const isLoading =
    !firstPokemonQueryResult.isLoading &&
    firstPokemonQueryResult.data &&
    !secondPokemonQueryResult.isLoading &&
    secondPokemonQueryResult.data;

  const voteForRoundest = (selected: number) => () => {
    setPokemonPair(getOptionsForVote());
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-2xl text-center">Which pokemon is rounder?</h1>
      <section className="flex items-center justify-between max-w-2xl p-8 mt-4 border rounded">
        {isLoading && (
          <>
            <PokemonSection
              pokemon={firstPokemonQueryResult.data}
              vote={voteForRoundest(pokemonPair[0])}
            />
            <div>VS</div>
            <PokemonSection
              pokemon={secondPokemonQueryResult.data}
              vote={voteForRoundest(pokemonPair[1])}
            />
          </>
        )}
      </section>
    </main>
  );
};

type PokemonFromServer = inferQueryResponse<"get-pokemon">;
const PokemonSection: FC<{ pokemon: PokemonFromServer; vote: () => void }> = ({
  pokemon,
  vote,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-64">
      <img className="w-full" src={pokemon?.sprite ?? undefined} />
      <h1 className="block text-2xl text-center capitalize mt-[-2rem]">
        {pokemon?.name}
      </h1>
      <Button onClickHandler={vote} style={{ marginTop: "1rem" }}>
        This one
      </Button>
    </div>
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
