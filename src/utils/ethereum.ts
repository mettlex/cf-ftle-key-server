export async function getCurrentTimestampFromEthereum({
  url,
}: {
  url: string;
}): Promise<number> {
  const response = await (
    await fetch(url, {
      headers: {
        accept: "application/json",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
      },
      body: '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}',
      method: "POST",
    })
  ).json();

  return Number(
    (response as { result: { timestamp: string } }).result.timestamp,
  );
}
