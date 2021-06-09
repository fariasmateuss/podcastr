/* eslint-disable import/no-duplicates */
import format from 'date-fns/format';
import enUS from 'date-fns/locale/en-US';

import styles from '@/styles/components/Header.module.scss';

export function Header() {
  const currentDate = format(new Date(), `d MMMM`, {
    locale: enUS,
  });

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>The best for you to hear, always</p>

      <span>{currentDate}</span>
    </header>
  );
}
