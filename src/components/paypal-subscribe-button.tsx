
'use client';

import { useLanguage } from '@/contexts/language-context';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalSubscribeButtonProps {
  planId: string;
}

export default function PayPalSubscribeButton({ planId }: PayPalSubscribeButtonProps) {
  const { t } = useLanguage();
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AYwh7UnUhNlDGI6_U2ETPJrx6BsydIe95wE2uOuciZI1rLEXKWO6ulz8pKMAwusIFqnakaarrOBQ2kww&vault=true&intent=subscription';
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.async = true;

    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal
          .Buttons({
            style: {
              shape: 'rect',
              color: 'gold',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: function (data: any, actions: any) {
              return actions.subscription.create({
                plan_id: planId,
              });
            },
            onApprove: function (data: any, actions: any) {
              alert('Subscription successful: ' + data.subscriptionID);
              // Here you would typically save the subscription ID to your backend
            },
            onError: function (err: any) {
              console.error('PayPal Buttons Error:', err);
            },
          })
          .render(paypalRef.current);
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [planId]);

  return <div ref={paypalRef} className="w-full"></div>;
}
