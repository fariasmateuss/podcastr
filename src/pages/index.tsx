import styles from '@/styles/pages/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <main />
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:3333/episodes`);
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },

    revalidate: 60 * 60 * 8,
  };
}
