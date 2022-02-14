import './App.css';
import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {  
  Program, Provider, web3
} from '@project-serum/anchor';
import idl from './mysolanaapp.json';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

const { SystemProgram, Keypair } = web3;

// create account
const baseAccount = Keypair.generate();
const opts = {
  preflightCommitent: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  const getProvider = async () => {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitent);

    const provider = new Provider(
      connection, wallet, opts.preflightCommitent,
    );

    return provider;
  }

  const createCounter = async () => {
    const provider = await getProvider();
    
    /**
     * create the program interface combining the idl, program ID, and provider
     */
    const program = new Program(idl, programID, provider);
    try {
      /** interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log('account: ', account);
      setValue(account.count.toString());
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('account: ', account);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>
          {
            !value && (<button onClick={createCounter}>Create counter</button>)
          }
          {
            value && <button onClick={increment}>Increment counter</button>
          }

          {
            value && value >= Number(0) ? (
              <h2>{value}</h2>
            ) : (
              <h3>Please create the counter.</h3>
            )
          }
        </div>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
