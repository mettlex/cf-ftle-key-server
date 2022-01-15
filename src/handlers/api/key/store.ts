import buf2hex from "../../../utils/ab-hex";
import { encrypt2ndKey } from "../../../utils/crypt";

interface RequestBody {
  "lock-duration"?: number;
  "first-secret-key"?: string;
  "second-secret-key"?: string;
}

export const handleKeyStoreRequest = async (
  request: Request,
): Promise<Response> => {
  const body = (await request.json()) as RequestBody;

  const firstSecretKey = body["first-secret-key"];
  const secondSecretKey = body["second-secret-key"];
  const lockDuration = body["lock-duration"];

  if (
    typeof firstSecretKey !== "string" ||
    typeof secondSecretKey !== "string" ||
    typeof lockDuration !== "number"
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

  const randomBytes = crypto.getRandomValues(new Uint8Array(12)).buffer;
  const salt = crypto.getRandomValues(new Uint8Array(16)).buffer;

  const encrypted2ndKey = await encrypt2ndKey({
    firstSecretKey,
    secondSecretKey,
    randomBytes,
    salt,
  });

  const digest = await crypto.subtle.digest("SHA-512", randomBytes);
  const randomBytesDigestHex = "0x" + buf2hex(digest);

  //@ts-ignore
  await (TIME_LOCK_KV as KVNamespace).put(
    randomBytesDigestHex,
    JSON.stringify({
      d: lockDuration,
      e: "0x" + buf2hex(encrypted2ndKey),
    }),
  );

  const response = new Response(
    JSON.stringify({
      "random-bytes": "0x" + buf2hex(randomBytes),
      "random-bytes-digest": randomBytesDigestHex,
      "key-derivation-algorithom": "PBKDF2",
      "key-derivation-salt": "0x" + buf2hex(salt),
    }),
  );

  return response;
};
