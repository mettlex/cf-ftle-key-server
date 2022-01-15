/**
 * Convert an ArrayBuffer to a hex string
 *
 * @param {ArrayBuffer} buffer The bytes in an ArrayBuffer
 * @return {string} hex representation of bytes without 0x
 */
export default function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Convert a hex string to an ArrayBuffer
 *
 * @param {string} hexString hex representation of bytes
 * @return {ArrayBuffer} the bytes in an ArrayBuffer
 */
export function hex2buf(hexString: string): ArrayBuffer {
  // remove the leading 0x
  hexString = hexString.replace(/^0x/, "");

  // ensure even number of characters
  if (hexString.length % 2 != 0) {
    console.log(
      "WARNING: expecting an even number of characters in the hexString",
    );
    return new ArrayBuffer(0);
  }

  // check for some non-hex characters
  const bad = hexString.match(/[G-Z\s]/i);

  if (bad) {
    console.log("WARNING: found non-hex characters", bad);
    return new ArrayBuffer(0);
  }

  // split the string into pairs of octets
  const pairs = hexString.match(/[\dA-F]{2}/gi);

  // convert the octets to integers
  const integers = pairs!.map(function (s) {
    return parseInt(s, 16);
  });

  return new Uint8Array(integers).buffer;
}
