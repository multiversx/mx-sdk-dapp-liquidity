/**
 * Bridge backend expects CAIP-2–style numeric chain ids for Sui (e.g. mainnet `784`).
 * AppKit may expose Sui as network slugs (`testnet`), or a single placeholder numeric
 * id (e.g. `184`) for all Sui networks — normalize here before any API/query use.
 */
export const BRIDGE_API_SUI_CHAIN_ID = '784';

type CaipNetworkLike = {
  chainNamespace?: string;
  caipNetworkId?: string;
} | null;

function isSuiNetwork(caipNetwork?: CaipNetworkLike): boolean {
  if (!caipNetwork) {
    return false;
  }
  return (
    caipNetwork.chainNamespace === 'sui' ||
    Boolean(caipNetwork.caipNetworkId?.startsWith('sui:'))
  );
}

const SUI_APPKIT_CHAIN_SLUGS = new Set(['mainnet', 'testnet', 'devnet']);

/** AppKit / embedded network list may use one id for every Sui network (not API-canonical). */
const APPKIT_SUI_PLACEHOLDER_IDS = new Set(['184']);

function suiSlugFromAppKit(
  chainId: string,
  caipNetwork?: CaipNetworkLike
): string {
  const caipId = caipNetwork?.caipNetworkId;
  if (caipId?.startsWith('sui:')) {
    return caipId.slice('sui:'.length).toLowerCase();
  }
  return chainId.toLowerCase();
}

/**
 * Maps any wallet / token `chainId` to the value expected by bridge HTTP APIs
 * (`/rate`, `/confirm`, balances, etc.).
 */
export function toBridgeApiChainId(
  chainId: string | number | null | undefined,
  caipNetwork?: CaipNetworkLike
): string | undefined {
  if (chainId == null || chainId === '') {
    return undefined;
  }

  const raw = String(chainId);

  if (APPKIT_SUI_PLACEHOLDER_IDS.has(raw) || raw === BRIDGE_API_SUI_CHAIN_ID) {
    return BRIDGE_API_SUI_CHAIN_ID;
  }

  const slug = suiSlugFromAppKit(raw, caipNetwork);

  const treatAsSui =
    isSuiNetwork(caipNetwork) ||
    (SUI_APPKIT_CHAIN_SLUGS.has(slug) && !/^\d+$/.test(raw));

  if (!treatAsSui) {
    return raw;
  }

  return BRIDGE_API_SUI_CHAIN_ID;
}

/** Compare two ids after Sui/AppKit normalization (e.g. `184` vs `784`). */
export function sameBridgeApiChainId(
  a: string | number | null | undefined,
  b: string | number | null | undefined
): boolean {
  return toBridgeApiChainId(a) === toBridgeApiChainId(b);
}
