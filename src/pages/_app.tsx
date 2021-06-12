import { AppProps } from 'next/app';
import { Header } from '@/components/Header';
import { Player } from '@/components/Player';

import styles from '../styles/pages/app.module.scss';

import '@/styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>

      <Player />
    </div>
  );
}
