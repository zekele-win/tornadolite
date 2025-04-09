declare module "ffjavascript" {
  export namespace utils {
    /**
     * Converts a little-endian buffer to a bigint.
     *
     * This function interprets the given buffer as a little-endian
     * encoded integer and converts it into a `bigint`.
     *
     * @param {Uint8Array} buff - The little-endian encoded buffer.
     * @returns {bigint} The corresponding bigint representation.
     */
    function leBuff2int(buff: Uint8Array): bigint;

    /**
     * Convert a bigint to a little-endian Uint8Array of specified length.
     *
     * @param {bigint} n - The integer to convert.
     * @param {number} len - The desired byte length of the output Uint8Array.
     * @returns {Uint8Array} The little-endian representation of the integer.
     */
    function leInt2Buff(n: bigint, len: number): Uint8Array;

    /**
     * Converts a big-endian buffer to a bigint.
     *
     * This function interprets the given buffer as a big-endian
     * encoded integer and converts it into a `bigint`.
     *
     * @param {Uint8Array} buff - The big-endian encoded buffer.
     * @returns {bigint} The corresponding bigint representation.
     */
    function beBuff2int(buff: Uint8Array): bigint;

    /**
     * Convert a bigint to a big-endian Uint8Array of specified length.
     *
     * @param {bigint} n - The integer to convert.
     * @param {number} len - The desired byte length of the output Uint8Array.
     * @returns {Uint8Array} The big-endian representation of the integer.
     */
    function beInt2Buff(n: bigint, len: number): Uint8Array;

    /**
     * Recursively converts all BigInt values in the given object into strings.
     * Useful for serializing data structures that contain BigInts (e.g. via JSON.stringify).
     *
     * @param o - Any object or value that may contain BigInts
     * @returns A copy of the input where all BigInts are converted to strings
     */
    function stringifyBigInts<T = any>(o: T): any;

    /**
     * Recursively converts all stringified integers in the given object back into BigInt values.
     * Useful for deserializing data structures containing stringified BigInts (e.g. from JSON.parse).
     *
     * @param o - Any object or value that may contain stringified integers
     * @returns A copy of the input where all numeric strings are converted back to BigInts
     */
    function unstringifyBigInts<T = any>(o: T): any;
  }
}
