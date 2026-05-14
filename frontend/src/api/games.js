import client from "./client";

export async function listGames() {
  const { data } = await client.get("/games");
  return data;
}
