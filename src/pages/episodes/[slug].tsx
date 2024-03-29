import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

import { convertDurationToTimeString } from '@/utils/convertDurationToTimeString';
import { api } from '@/services/api';

import styles from '@/styles/pages/Episodes.module.scss';
import { usePlayer } from '@/context/PlayerContext';

interface slugParams extends ParsedUrlQuery {
  slug: string;
}

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
  description: string;
  duration: number;
  url: string;
}

interface EpisodeProps {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Retornar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Reproduzir" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: episode.description,
        }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 2,
      _sort: `published_at`,
      _order: `desc`,
    },
  });

  const paths = data.map((episode: Episode) => ({
    params: {
      slug: episode.id,
    },
  }));

  return {
    paths,
    fallback: `blocking`,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as slugParams;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), `d MMM yy`, {
      locale: enUS,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },

    revalidate: 60 * 60 * 24,
  };
};
