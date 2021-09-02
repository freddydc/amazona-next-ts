import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import StoreProvider from '@utils/store/Store';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
};

export default MyApp;
