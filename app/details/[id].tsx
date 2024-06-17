import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';
import { globalStyles } from '../../styles';
import { theme } from '../../theme';

import { Badge } from '../../components/Badge';
import { ButtonNetwork } from '../../components/ButtonNetwork';
import { ClockFillIcon, StarFillIcon } from '../../components/Icon';
import { List } from '../../components/List';
import { PersonThumb } from '../../components/PersonThumb';
import { Text } from '../../components/Text';
import { ThumbLink } from '../../components/ThumbLink';
import { ContentLayout } from '../../layouts/Content';
import { formatTime } from '../../utils/time';
import { LargeThumb } from '@/components/LargeThumb';
import { useLocalSearchParams } from 'expo-router';

const API_KEY = "732bff128826232c81735312be89062c";; // Replace with your actual TMDb API key

interface NetworkLink {
  id: number;
  link: string;
}

interface Rating {
  votes: number;
  count: number;
}

interface Logo {
  url: string;
  aspectRatio: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface MovieDetails {
  id: number;
  backdrop_path: string;
  title: string;
  genres: { name: string }[];
  homepage: string;
  overview: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  production_companies: { logo_path: string, name: string }[];
  credits: {
    cast: CastMember[];
  };
}

const Movie: React.FC = () => {
  const [movieData, setMovieData] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const params = useLocalSearchParams();
  const movieID = Number(params?.id);
  console.log(movieID, "IDDDD")

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&append_to_response=credits`
        );
        console.log(response,"responsss")
        setMovieData(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieID]);

  if (loading) {
    return <ActivityIndicator size="large" color="#E50914" />;
  }

  if (!movieData) {
    return <Text>Error loading movie details.</Text>;
  }

  const {
    backdrop_path,
    title,
    genres,
    homepage,
    overview,
    tagline,
    vote_average,
    vote_count,
    release_date,
    runtime,
    production_companies,
    credits,
  } = movieData;

  const renderItemCast = ({ item }: { item: CastMember }) => (
    <ThumbLink href={`person/${item.id}`}>
      <PersonThumb imageUrl={`https://image.tmdb.org/t/p/w200${item.profile_path}`} name={item.name} character={item.character} />
    </ThumbLink>
  );

  return (
    <SafeAreaView style={{flex:1}}>
    <ContentLayout
      isLoading={loading}
      // imageUrl={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
      // title={title}
      subtitle={genres.map(genre => genre.name).join(', ')}
      // logo={{ url: production_companies[0]?.logo_path ? `https://image.tmdb.org/t/p/w500${production_companies[0].logo_path}` : '', aspectRatio: 16 / 9 }}
      badges={
        <>
          {!!release_date && (
            <Badge>
              <Text>{new Date(release_date).toLocaleDateString()}</Text>
            </Badge>
          )}
          {!!runtime && (
            <Badge icon={ClockFillIcon}>{formatTime(runtime)}</Badge>
          )}
          {!!vote_average && (
            <Badge icon={StarFillIcon}>
              {vote_average} ({vote_count})
            </Badge>
          )}
        </>
      }
    >
      <LargeThumb
        id={movieID}
        imageUrl={`https://image.tmdb.org/t/p/w780${backdrop_path}`}
        imageWidth="w780"
        title={title}
        type="movie"
        logoUrl={`https://image.tmdb.org/t/p/w500${production_companies[0]?.logo_path}`}
        logoAspectRatio={16 / 9}
      />
      {/* {!!homepage && (
        <ButtonNetwork
          id={1}
          link={homepage}
          style={globalStyles.centered}
        />
      )} */}
      <View style={styles.content}>
        {(!!overview || !!tagline) && (
          <Text variant="lg" style={styles.tagline}>
            {overview || tagline}
          </Text>
        )}
        {!!credits.cast && credits.cast.length > 0 && (
          <List
            title="CASTING"
            isLoading={false}
            id="cast"
            renderItem={renderItemCast}
            results={credits.cast}
          />
        )}
      </View>
    </ContentLayout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tagline: {
    color: theme.colors.white,
    marginTop: theme.space.md,
    paddingHorizontal: theme.space.marginList,
  },
  content: {
    gap: theme.space.xl,
  },
});

export default Movie;
