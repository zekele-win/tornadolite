declare module "circom_tester" {
  export interface WasmTester {
    calculateWitness(
      input: { [key: string]: bigint },
      sanityCheck: boolean
    ): Promise<Array<bigint>>;

    getOutput(
      witness: Array<bigint>,
      output: { [key: string]: number } | Array<number> | number
    ): Promise<{ [key: string]: bigint } | Array<bigint> | bigint>;

    assertOut(
      actualOut: Array<bigint>,
      expectedOut: { [key: string]: bigint } | Array<bigint> | bigint
    ): Promise<void>;
  }

  export function wasm(filePath: string): Promise<WasmTester>;
}
