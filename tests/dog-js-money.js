const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("mysolanaapp", () => {
  const provider = anchor.Provider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // Counter for the tests.
  
  // Program for the tests.
  const program = anchor.workspace.Mysolanaapp;
  
  it("Creates a counter", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create(provider.wallet.publicKey, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    let account = await program.account.baseAccount.fetch(counter.publicKey);

    assert.ok(account.authority.equals(provider.wallet.publicKey));
    assert.ok(account.count.toNumber() === 0);

    // ??????
    _baseAccount = baseAccount;
  });

  it("Updates a counter", async () => {
    
    // ??????
    const baseAccount = _baseAccount;

    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const counterAccount = await program.account.counter.fetch(
      baseAccount.publicKey
    );

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAccount.count.toNumber() == 1);
  });
});