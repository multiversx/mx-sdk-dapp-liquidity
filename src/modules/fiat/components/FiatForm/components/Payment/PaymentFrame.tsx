import React, { useEffect, useRef, useState } from 'react';
import { MxCircleLoader } from 'reactjs/components/base/MxCircleLoader/MxCircleLoader';
import { mxClsx } from '../../../../../../reactjs';

interface PaymentFrameProps {
  htmlContent: string;
}

export const PaymentFrame: React.FC<PaymentFrameProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formLoaded, setFormLoaded] = useState(false);

  const onIframeLoad = () => {
    console.log('Payment form loaded');
    setFormLoaded(true);
  };

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }

      iframe?.addEventListener?.('load', onIframeLoad);
    }
  }, [htmlContent]);

  useEffect(() => {
    const iframe = iframeRef.current;

    return () => {
      iframe?.removeEventListener?.('load', onIframeLoad);
    };
  }, []);

  return (
    <div className="liq-relative liq-w-full">
      {!formLoaded && (
        <div className="payment-iframe liq-w-full  liq-rounded-md liq-border liq-border-neutral-700">
          <MxCircleLoader />
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Buy with FIAT"
        className={mxClsx(
          'payment-iframe scrollbar-thin liq-w-full liq-rounded-md liq-border liq-border-neutral-700',
          {
            hidden: !formLoaded
          }
        )}
        loading="lazy"
        // sandbox="allow-scripts allow-forms"
        // sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        // sandbox="allow-scripts allow-forms allow-same-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation allow-forms allow-modals allow-pointer-lock allow-orientation-lock"
      />
    </div>
  );
};
