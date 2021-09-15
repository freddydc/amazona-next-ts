import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import StoreProvider from '@utils/store/Store';
import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true} options={{ 'client-id': '' }}>
          <Component {...pageProps} />
        </PayPalScriptProvider>{' '}
      </StoreProvider>
    </SnackbarProvider>
  );
};

export default MyApp;
