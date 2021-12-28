import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [first, second] = getOptionsForVote();

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <h1 className="text-2xl text-center">Which pokemon is rounder?</h1>
      <section className="flex items-center justify-between max-w-2xl p-8 mt-4 border rounded">
        <div className="w-16 h-16 bg-red-400">{first}</div>
        <div>VS</div>
        <div className="w-16 h-16 bg-red-400">{second}</div>
      </section>
    </main>
  );
};

export default Home;
