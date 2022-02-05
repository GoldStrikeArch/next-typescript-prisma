import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "@/backend/utils/prisma";

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

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

function ResultsPage() {
  return (
    <div>
      <h1>haha</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const pokemonList = await getPokemonInOrder();
  return {
    props: {
      pokemonList,
    },
  };
};

export default ResultsPage;
