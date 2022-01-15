// solana main-net
// const url = "https://api.mainnet-beta.solana.com";

// solana dev-net
// const url = "https://api.devnet.solana.com";

const headers = {
  "Content-Type": "application/json",
};

export const getCurrentTimestampFromSolana = async ({
  url,
}: {
  url: string;
}): Promise<number> => {
  let query = `{"id":1, "jsonrpc":"2.0", "method":"getVersion"}`;

  let response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  });

  const version = (
    (await response.json()) as { result: { "solana-core": string } }
  ).result["solana-core"];

  let methodName = "getLatestBlockhash";

  if (version.startsWith("1.8")) {
    methodName = "getRecentBlockhash";
  }

  query = `{"id":1, "jsonrpc":"2.0", "method":"${methodName}"}`;

  response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  });

  const slot = (
    (await response.json()) as { result: { context: { slot: number } } }
  ).result.context.slot;

  query = `{"jsonrpc":"2.0","id":1, "method":"getBlockTime","params":[${slot}]}`;

  response = await fetch(url, {
    method: "POST",
    body: query,
    headers,
  });

  const timestamp = ((await response.json()) as { result: number }).result;

  return timestamp;
};
