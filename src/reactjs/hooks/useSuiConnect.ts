import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
  useDisconnect
} from '@reown/appkit/react';
import { ChainController } from '@reown/appkit-controllers';
import { useCallback, useEffect, useRef, useState } from 'react';

const SUI_NS = 'sui' as const;

/** User may be on QR / wallet approval */
const STUCK_WHILE_MODAL_OPEN_MS = 60_000;
/** Reconnect/sync often sets `connecting` with modal closed — must recover quickly */
const STUCK_WHILE_MODAL_CLOSED_MS = 8_000;
const MODAL_CLOSE_SETTLE_MS = 200;
/**
 * After a full reload, AppKit sets Sui to `connecting` while WC restores the session from
 * storage. The short "stuck connecting" timeout must not run during that window or it will
 * disconnect and clear the valid session.
 */
const WC_RECONNECT_GRACE_MS = 25_000;

export function useSuiConnect() {
  const { open: openAppKitModal } = useAppKit();
  const { open: isModalOpen } = useAppKitState();
  const { disconnect: appKitDisconnect } = useDisconnect();
  const appKitAccount = useAppKitAccount({ namespace: SUI_NS as any });

  const wasModalOpenRef = useRef(isModalOpen);
  const [reconnectGraceExpired, setReconnectGraceExpired] = useState(false);
  useEffect(() => {
    const t = globalThis.setTimeout(
      () => setReconnectGraceExpired(true),
      WC_RECONNECT_GRACE_MS
    );
    return () => globalThis.clearTimeout(t);
  }, []);

  const clearStuckConnecting = useCallback(async () => {
    if (appKitAccount.status !== 'connecting' || appKitAccount.isConnected) {
      return;
    }
    try {
      await appKitDisconnect({ namespace: SUI_NS as any });
    } catch {
      // ignore
    }
    try {
      // disconnect() often does not clear `connecting` when WC/AppKit desync (shared SignClient, etc.)
      ChainController.resetAccount(SUI_NS);
    } catch {
      // ignore
    }
  }, [appKitAccount.status, appKitAccount.isConnected, appKitDisconnect]);

  useEffect(() => {
    const prev = wasModalOpenRef.current;
    wasModalOpenRef.current = isModalOpen;
    if (prev === true && isModalOpen === false) {
      const t = globalThis.setTimeout(() => {
        void clearStuckConnecting();
      }, MODAL_CLOSE_SETTLE_MS);
      return () => globalThis.clearTimeout(t);
    }
  }, [isModalOpen, clearStuckConnecting]);

  useEffect(() => {
    if (appKitAccount.status !== 'connecting' || appKitAccount.isConnected) {
      return;
    }
    if (!reconnectGraceExpired) {
      return;
    }
    const delayMs = isModalOpen
      ? STUCK_WHILE_MODAL_OPEN_MS
      : STUCK_WHILE_MODAL_CLOSED_MS;
    const t = globalThis.setTimeout(() => {
      void clearStuckConnecting();
    }, delayMs);
    return () => globalThis.clearTimeout(t);
  }, [
    appKitAccount.status,
    appKitAccount.isConnected,
    isModalOpen,
    reconnectGraceExpired,
    clearStuckConnecting
  ]);

  const connect = useCallback(() => {
    openAppKitModal({ view: 'Connect', namespace: SUI_NS as any });
  }, [openAppKitModal]);

  const disconnect = useCallback(async () => {
    try {
      await appKitDisconnect({ namespace: SUI_NS as any });
    } catch (error) {
      console.error('Sui disconnect failed:', error);
    }
  }, [appKitDisconnect]);

  return {
    suiAddress: appKitAccount.address ?? null,
    isConnecting: appKitAccount.status === 'connecting',
    isConnected: appKitAccount.isConnected,
    connect,
    disconnect,
    cancelPendingConnection: clearStuckConnecting
  };
}
