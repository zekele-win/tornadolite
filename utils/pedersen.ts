import { utils as ffutils } from "ffjavascript";
import { buildPedersenHash } from "circomlibjs";

/**
 * Compute Pedersen hash.
 *
 * @param {bigint | Uint8Array} data - The input data to hash.
 * @returns {bigint} The computed hash value.
 */
export async function hash(data: bigint | Uint8Array): Promise<bigint> {
  if (typeof data === "bigint") {
    data = ffutils.leInt2Buff(data, 31);
  }

  const pedersen = await buildPedersenHash();

  // Calc hash.
  const hashPoint = pedersen.babyJub.unpackPoint(pedersen.hash(data));
  // Use x-coordinate as hash value.
  const hash = hashPoint[0];
  // Make sure hash < BN254.
  return pedersen.babyJub.F.toObject(hash);
}
