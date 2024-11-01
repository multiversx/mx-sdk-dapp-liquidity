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

```tsx
import { init, Web3AppProvider } from '@multiversx/mx-sdk-dapp-liquidity';
import {
  arbitrum,
  mainnet,
  solana,
  solanaDevnet,
  bscTestnet,
  zkSyncSepoliaTestnet,
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
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, bscTestnet, arbitrum, solana, solanaDevnet, zkSyncSepoliaTestnet, fantomTestnet ]

const { config, appKit, options } = init({
  appKitOptions: {
    projectId,
    networks,
    metadata,
    connectorImages: {
      injected: 'https://avatars.githubusercontent.com/u/179229932',
      walletConnect: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
      "io.metamask": 'https://avatars.githubusercontent.com/u/11744586?s=200&v=4',
      "com.trustwallet.app": 'https://avatars.githubusercontent.com/u/32179889?s=200&v=4',
    }
  },
  adapterConfig: {
    ssr: true,
    connectors: [
      walletConnect({
        projectId,
        metadata,
        showQrModal: true
      })
      // Add more connectors here
    ]
  },
  acceptedConnectorsIDs: [
    'io.metamask',
    'com.trustwallet.app',
    'walletconnect'
  ]
});

const App = () => {
  return (
    // Wrap your app with Web3AppProvider to enable multi-chain connections
    <Web3AppProvider appKit={appKit} config={config} options={options}>
      <YourComponent />
    </Web3AppProvider>
  )
}
```