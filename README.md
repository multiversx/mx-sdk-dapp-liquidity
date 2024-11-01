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
import { walletConnect, injected } from 'wagmi/connectors'

// This is mandatory to initialize the SDK in order to support multi chain connections
const { config, appKit } = init({
  projectID: 'your-@rewon-project',
  metadata: {
    name: 'AppName',
    description: 'AppName Example',
    url: 'https://example.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },
  networks: [mainnet, bsc, bscTestnet, arbitrum, solana, solanaDevnet, zkSyncSepoliaTestnet, fantomTestnet],
  adapterConfig: {
    ssr: true,
    connectors: [
      injected({
        shimDisconnect: true
      }),
      walletConnect({
        projectId: 'your-@rewon-project',
        metadata,
        showQrModal: false
      }),
    ]
  }
})

const App = () => {
  return (
    // Wrap your app with Web3AppProvider to enable multi-chain connections
    <Web3AppProvider appKit={appKit} config={config}>
      <YourComponent />
    </Web3AppProvider>
  )
}
```