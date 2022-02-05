import type { NextFetchEvent, NextRequest } from "next/server";
import { populateDb } from "scripts/populateDbWithAllPokemons";

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  populateDb();
  return new Response("Hello, world!");
}
