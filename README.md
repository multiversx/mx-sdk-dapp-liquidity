# @multiversx/mx-sdk-dapp-liquidity

## Overview

Generic SDK for multi-chain wallet connections and transaction signing.

## Installation

```bash
npm install @multiversx/mx-sdk-dapp-liquidity
```

## Commands

### Install dependencies

```bash
yarn
```

### Start

```bash
yarn start
```

### Build

```bash
yarn build
```

### Build and watch

```bash
yarn build:watch
```

### Test

```bash
yarn test
```

### Lint

```bash
yarn lint
```

### Release (publish)

```bash
yarn publish-package
```

### Release next version (publish)

```bash
yarn publish-package-next
```

## Usage

```css
@import 'node_modules/@multiversx/mx-sdk-dapp-liquidity/style.css';
```

```tsx
import { init, Web3AppProvider } from '@multiversx/mx-sdk-dapp-liquidity';
import {
  bscTestnet,
  fantomTestnet,
} from '@reown/appkit/networks'
import {DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID} from "../constants";
import type {AppKitNetwork} from "@reown/appkit-common";
import { walletConnect } from "wagmi/connectors";

const metadata = {
  name: 'AppName',
  description: 'AppName Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};
const projectId = "@reown project id";
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bscTestnet, fantomTestnet ]
const provider = init({
  /**
   * @reown AppKit options
   */
  appKitOptions: {
    allowUnsupportedChain: true,
    projectId,
    networks,
    metadata,
    connectorImages: {
      injected: 'https://avatars.githubusercontent.com/u/179229932',
      walletConnect: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      "io.metamask": 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4',
      "com.trustwallet.app": 'https://avatars.githubusercontent.com/u/32179889?s=200&v=4',
    },
    themeMode: "dark",
    themeVariables: {
      "--w3m-font-family": "Roobert,system-ui,sans-serif",
    },
    features: {
      email: false,
      socials: false,
    }
  },
  /**
   * WagmiAdapter config
   */
  adapterConfig: {
    ssr: true,
  },
  /**
   * Accepted chain IDs. The chains with ids [31, 44, 54] will be ignored as these are mapped to the mvx networks as [1, D, T]
   */
  acceptedChainIDs: ["97", "4002"],
  /**
   * Accepted connectors IDs
   */
  acceptedConnectorsIDs: [
    'io.metamask',
    'com.trustwallet.app',
    'walletconnect'
  ],
  /**
   * Liquidity API URL
   */
  apiURL: "https://devnet-tools.multiversx.com/liquidity-sdk",
  /**
   * Bridge URL. This is used to redirect the user to the bridge status page for tracking transactions (history). Will be removed in the next major release.
   */
  bridgeURL: "https://devnet-bridge.multiversx.com",
  /**
   * MultiversX API URL
   */
  mvxApiURL: "https://devnet-api.multiversx.com",
  /**
   * MultiversX Explorer URL
   */
  mvxExplorerAddress: "https://devnet-explorer.multiversx.com",
  /**
   * MultiversX Chain ID
   * Possible options 31 | 44 | 54 which are mapped to 1 | D | T
   */
  mvxChainId: "44",
});

const App = () => {
  const [showHistory, setShowHistory] = useState(false);
  
  const mvxAccount = useGetAccount();
  const evmAccount = useAccount();
  const nativeAuthToken = useGetNativeAuthToken();

  const onConnectToMvx = async () => {
    // Login to MultiversX
  }
    
  const onDisconnectFromMvx = async () => {
    // Logout from MultiversX
  }
  
  const onHistoryClose = () => {
    setShowHistory(false);
  }
  
  return (
    // Wrap your app with Web3AppProvider to enable multi-chain connections
    <Web3AppProvider appKit={provider.appKit} config={provider.config} options={provider.options}>
      <BridgeForm
        mvxChainId={"44"}
        mvxAddress={mvxAccount?.address}
        username={mvxAccount?.username}
        nativeAuthToken={nativeAuthToken}
        callbackRoute={"/deposit"}
        showHistory={showHistory}
        onSuccessfullySentTransaction={(txHashes) => {
          // DO SOMETHING
        }}
        onFailedSentTransaction={() => {
          // DO SOMETHING
        }}
        onHistoryClose={onHistoryClose}
        onMvxConnect={onConnectToMvx}
        onMvxDisconnect={onDisconnectFromMvx}
      />
      <TransactionToastContainer theme="colored" />
    </Web3AppProvider>
  )
}
```