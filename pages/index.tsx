import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl text-center">Which pokemon is rounder?</h1>
      <section className="border rounded p-8 mt-4 flex justify-between max-w-2xl items-center">
        <div className="bg-red-400 w-16 h-16">ASd</div>
        <div>VS</div>
        <div className="bg-red-400 w-16 h-16">ASd</div>
      </section>
    </main>
  );
};

export default Home;
