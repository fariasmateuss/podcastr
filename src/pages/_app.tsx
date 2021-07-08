import '@/styles/global.scss';
import { AppProps } from 'next/app';

import { Header } from '@/components/Header';
import { Player } from '@/components/Player';
import { PlayerContextProvider } from '@/context/PlayerContext';

import styles from '@/styles/pages/app.module.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  );
}
