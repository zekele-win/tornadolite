/**
 * Convert Buffer or bigint to a hex string.
 *
 * @param {Uint8Array | bigint | string} data - The Buffer or bigint or string to convert.
 * @param {number} [length=32] - The expected byte length (optional, used for zero-padding).
 * @returns {string} The hex string prefixed with "0x".
 */
export function to(
  data: Uint8Array | bigint | string,
  length: number = 32
): string {
  const hex =
    data instanceof Uint8Array
      ? Buffer.from(data).toString("hex")
      : typeof data === "bigint"
      ? data.toString(16)
      : typeof data === "string"
      ? BigInt(data).toString(16)
      : "";
  return "0x" + hex.padStart(length * 2, "0");
}
