import {
  encryption_algorithm,
  hash_algorithm,
  key_derivation_algorithom,
  key_derivation_iterations,
} from "../constants";

interface Inputs {
  firstSecretKey: string;
  secondSecretKey: string;
  randomBytes: ArrayBuffer;
  salt: ArrayBuffer;
}

export const encrypt2ndKey = async ({
  firstSecretKey,
  secondSecretKey,
  randomBytes,
  salt,
}: Inputs): Promise<ArrayBuffer> => {
  const importedKeyFrom1stKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(firstSecretKey),
    key_derivation_algorithom,
    false,
    ["deriveKey"],
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: key_derivation_algorithom,
      salt,
      iterations: key_derivation_iterations,
      hash: hash_algorithm,
    },
    importedKeyFrom1stKey,
    { name: encryption_algorithm, length: 256 },
    true,
    ["encrypt"],
  );

  const encrypted2ndKey = await crypto.subtle.encrypt(
    { name: encryption_algorithm, iv: randomBytes },
    derivedKey,
    new TextEncoder().encode(secondSecretKey),
  );

  return encrypted2ndKey;
};
