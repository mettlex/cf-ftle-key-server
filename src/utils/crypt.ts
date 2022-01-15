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
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-512",
    },
    importedKeyFrom1stKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"],
  );

  const encrypted2ndKey = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: randomBytes },
    derivedKey,
    new TextEncoder().encode(secondSecretKey),
  );

  return encrypted2ndKey;
};
