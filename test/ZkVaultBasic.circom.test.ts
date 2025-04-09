import { expect } from "chai";
import { wasm, WasmTester } from "circom_tester";
import { hash as pedersenHash } from "../utils/pedersen";

describe("ZkVaultBasic _circuit", () => {
  let _circuit: WasmTester;

  before(async () => {
    _circuit = await wasm("./circuits/ZkVaultBasic.circom");
  });

  it("Should output consistent commitment and recipient.", async () => {
    const secret = 1234n;
    const recipient = 5678n;
    const commitment = await pedersenHash(secret);

    const witness = await _circuit.calculateWitness(
      { commitment, recipient, secret },
      true
    );

    // const { commitmentOut, recipientOut } = (await _circuit.getOutput(witness, {
    //   commitmentOut: 1,
    //   recipientOut: 1,
    // })) as { [key: string]: bigint };
    // expect(commitmentOut).to.equal(commitment);
    // expect(recipientOut).to.equal(recipient);

    await _circuit.assertOut(witness, { commitmentOut: commitment });
    await _circuit.assertOut(witness, { recipientOut: recipient });
  });

  it("Should throw error if recipient = 0n.", async () => {
    const secret = 1234n;
    const recipient = 0n;
    const commitment = await pedersenHash(secret);

    // try {
    //   await _circuit.calculateWitness({ commitment, recipient, secret }, true);
    //   expect.fail("Should have caught an error on recipient == 0");
    // } catch (err) {
    //   if (err instanceof Error) {
    //     expect(err.message).to.include("Assert Failed");
    //   } else {
    //     expect.fail("Caught an unknown error type");
    //   }
    // }

    // let error;
    // try {
    //   await _circuit.calculateWitness({ commitment, recipient, secret }, true);
    // } catch (err) {
    //   error = err;
    // }
    // expect(error).to.instanceOf(Error);
    // expect((error as Error).message).to.include("Assert Failed");

    await expect(
      _circuit.calculateWitness({ commitment, recipient, secret }, true)
    ).to.be.rejectedWith(Error, /Assert Failed/);
  });

  it("Should throw error if secret = 0n.", async () => {
    const secret = 0n;
    const recipient = 5678n;
    const commitment = await pedersenHash(secret);

    await expect(
      _circuit.calculateWitness({ commitment, recipient, secret }, true)
    ).to.be.rejectedWith(Error, /Assert Failed/);
  });

  it("Should throw error if commitment is incorrect.", async () => {
    const secret = 1234n;
    const recipient = 5678n;
    const commitment = 0xabcdn;

    await expect(
      _circuit.calculateWitness({ commitment, recipient, secret }, true)
    ).to.be.rejectedWith(Error, /Assert Failed/);
  });
});
