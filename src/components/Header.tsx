import styles from '@/styles/components/Header.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr" />

      <p>The best for you to hear, always</p>

      <span>Jun 8</span>
    </header>
  );
}
