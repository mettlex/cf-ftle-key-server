import buf2hex, { hex2buf } from "../../../utils/ab-hex";
import { getCurrentTimestampFromSolana } from "../time/helpers/solana";

interface RequestBody {
  first_secret_key?: string;
  random_bytes?: string;
  random_bytes_digest?: string;
  key_derivation_algorithom?: "PBKDF2";
  key_derivation_salt?: string;
}

interface ResponseBody {
  status: "STARTED" | "PENDING" | "FINISHED";
  duration: number;
  unlocks_at: number;
  encrypted_second_key?: string;
}

export const handleKeyRecoverRequest = async (
  request: Request,
): Promise<Response> => {
  const body = (await request.json()) as RequestBody;

  const firstSecretKey = body["first_secret_key"];
  const randomBytesHex = body["random_bytes"];
  const randomBytesDigestHex = body["random_bytes_digest"];
  const keyDerivationAlgorithm = body["key_derivation_algorithom"];
  const keyDerivationSaltHex = body["key_derivation_salt"];

  if (
    typeof firstSecretKey !== "string" ||
    typeof randomBytesHex !== "string" ||
    typeof randomBytesDigestHex !== "string" ||
    typeof keyDerivationSaltHex !== "string" ||
    keyDerivationAlgorithm !== "PBKDF2"
  ) {
    return new Response(JSON.stringify({ error: "invalid request body" }), {
      status: 400,
    });
  }

  if (firstSecretKey.length > 255) {
    return new Response(
      JSON.stringify({ error: "keys can't be more than 255 bytes long" }),
      {
        status: 400,
      },
    );
  }

  //@ts-ignore
  const data = await (TIME_LOCK_KV as KVNamespace).get(randomBytesDigestHex);

  if (!data) {
    return new Response(
      JSON.stringify({ error: "random bytes digest not found in storage" }),
      {
        status: 404,
      },
    );
  }

  const randomBytes = hex2buf(randomBytesHex);

  const digest =
    "0x" + buf2hex(await crypto.subtle.digest("SHA-512", randomBytes));

  if (digest !== randomBytesDigestHex) {
    return new Response(
      JSON.stringify({
        error: "random bytes digest didn't match with stored digest",
      }),
      {
        status: 400,
      },
    );
  }

  const storedData = JSON.parse(data) as {
    f: string;
    d: number;
    e: string;
    u: number;
  };

  const { f, d, e, u } = storedData;

  const firstSecretKeyDigestHex =
    "0x" +
    buf2hex(
      await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(firstSecretKey),
      ),
    );

  if (firstSecretKeyDigestHex !== f) {
    return new Response(
      JSON.stringify({
        error: "first secret key digest didn't match with stored digest",
      }),
      {
        status: 400,
      },
    );
  }

  let timestamp: number | null;

  try {
    timestamp = await getCurrentTimestampFromSolana({
      url: "https://api.mainnet-beta.solana.com",
    });
  } catch (error) {
    console.error(error);

    try {
      timestamp = await getCurrentTimestampFromSolana({
        url: "https://solana-api.projectserum.com",
      });
    } catch (error) {
      console.error(error);
      timestamp = null;
    }
  }

  if (!timestamp) {
    const response = new Response(
      JSON.stringify({ error: "unable to get current timestamp" }),
      { status: 500 },
    );

    return response;
  }

  if (!u) {
    storedData.u = timestamp + d;

    //@ts-ignore
    await (TIME_LOCK_KV as KVNamespace).put(
      randomBytesDigestHex,
      JSON.stringify({
        ...storedData,
        u: storedData.u,
      }),
    );

    const responseBody: ResponseBody = {
      status: "STARTED",
      duration: d,
      unlocks_at: storedData.u,
    };

    const response = new Response(JSON.stringify(responseBody));

    return response;
  }

  if (timestamp > storedData.u) {
    const responseBody: ResponseBody = {
      status: "FINISHED",
      duration: d,
      unlocks_at: storedData.u,
      encrypted_second_key: e,
    };

    const response = new Response(JSON.stringify(responseBody));

    return response;
  }

  const responseBody: ResponseBody = {
    status: "PENDING",
    duration: d,
    unlocks_at: storedData.u,
  };

  const response = new Response(JSON.stringify(responseBody));

  return response;
};
