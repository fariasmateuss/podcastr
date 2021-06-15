import { GetServerSideProps } from 'next';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { convertDurationToTimeString } from '@/utils/convertDurationToTimeString';
import { api } from '@/services/api';

import Image from 'next/image';

import styles from '@/styles/pages/Home.module.scss';

interface File {
  duration: number;
  url: string;
}

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  file: File;
  publishedAt: Date;
  durationAsString: string;
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Latest Episodes</h2>

        <ul>
          {latestEpisodes.map((episode) => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <a href="@">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Play" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>All episodes</h2>

        <table cellSpacing={0}>
          <thead>
            <th />
            <th>Podcast</th>
            <th>Members</th>
            <th>Date</th>
            <th>Duration</th>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => (
              <tr key={episode.id}>
                <td>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <a href="@">{episode.title}</a>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Play" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetServerSideProps = async () => {
  const { data } = await api.get(`/episodes`, {
    params: {
      _limit: 12,
      _sort: `published_at`,
      _order: `desc`,
    },
  });

  const episodes = data.map((episode: Episode) => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), `d MMM yy`, {
      locale: enUS,
    }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration),
    ),
    url: episode.file.url,
  }));

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },

    revalidate: 60 * 60 * 8,
  };
};
