pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/bitify.circom";
include "../node_modules/circomlib/circuits/pedersen.circom";

template CommitmentHasher() {
    signal input secret;
    signal output commitment;

    component commitmentHasher = Pedersen(248);
    component secretBits = Num2Bits(248);

    secretBits.in <== secret;
    for (var i = 0; i < 248; i++) {
        commitmentHasher.in[i] <== secretBits.out[i];
    }

    commitment <== commitmentHasher.out[0];
}

template Withdraw() {
    signal input commitment;
    signal input recipient;
    signal input secret;

    signal output commitmentOut;
    signal output recipientOut;

    assert(recipient != 0);
    assert(secret != 0);

    component hasher = CommitmentHasher();
    hasher.secret <== secret;
    hasher.commitment === commitment;

    commitmentOut <== hasher.commitment;
    recipientOut <== recipient;
}

component main {public [commitment, recipient]} = Withdraw();
