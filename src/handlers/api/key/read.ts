import buf2hex, { hex2buf } from "../../../utils/ab-hex";
import { encrypt2ndKey } from "../../../utils/crypt";

interface RequestBody {
  "first-secret-key"?: string;
  "second-secret-key"?: string;
  "random-bytes"?: string;
  "random-bytes-digest"?: string;
  "key-derivation-algorithom"?: "PBKDF2";
  "key-derivation-salt"?: string;
}

export const handleKeyReadRequest = async (
  request: Request,
): Promise<Response> => {
  const body = (await request.json()) as RequestBody;

  const firstSecretKey = body["first-secret-key"];
  const secondSecretKey = body["second-secret-key"];
  const randomBytesHex = body["random-bytes"];
  const randomBytesDigestHex = body["random-bytes-digest"];
  const keyDerivationAlgorithm = body["key-derivation-algorithom"];
  const keyDerivationSaltHex = body["key-derivation-salt"];

  if (
    typeof firstSecretKey !== "string" ||
    typeof secondSecretKey !== "string" ||
    typeof randomBytesHex !== "string" ||
    typeof randomBytesDigestHex !== "string" ||
    typeof keyDerivationSaltHex !== "string" ||
    keyDerivationAlgorithm !== "PBKDF2"
  ) {
    return new Response(JSON.stringify({ error: "invalid request body" }), {
      status: 400,
    });
  }

  if (firstSecretKey.length > 255 || secondSecretKey.length > 255) {
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

  const { e: encrypted2ndKeyFromStorage } = JSON.parse(data) as {
    d: number;
    e: string;
  };

  const randomBytes = hex2buf(randomBytesHex);
  const salt = hex2buf(keyDerivationSaltHex);

  const encrypted2ndKeyHex =
    "0x" +
    buf2hex(
      await encrypt2ndKey({
        firstSecretKey,
        secondSecretKey,
        randomBytes,
        salt,
      }),
    );

  if (encrypted2ndKeyFromStorage === encrypted2ndKeyHex) {
    const response = new Response(data);
    return response;
  }

  const response = new Response(
    JSON.stringify({ error: "encrypted second secret key did not match" }),
  );

  return response;
};
