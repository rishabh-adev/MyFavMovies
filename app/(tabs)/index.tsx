import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { StyleSheet, Image, View, FlatList, TouchableOpacity, Text, ActivityIndicator, Animated, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GradientHeader } from '@/components/GradientHeader';
import { BasicLayout } from '@/layouts/Basic';
import { theme } from '../../theme';
import { ThumbLink } from '@/components/ThumbLink';
import { LargeThumb } from '@/components/LargeThumb';
import { router } from 'expo-router';

// Define a type for movie data
interface Movie {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
}

type SortOption = 'popular' | 'top_rated';

const API_KEY = "732bff128826232c81735312be89062c"; // Replace with your MovieDB API key
const API_URL_POPULAR = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
const API_URL_TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

const fetchMovies = async (sort: SortOption, pageNum: number) => {
  const API_URL = sort === 'popular' ? API_URL_POPULAR : API_URL_TOP_RATED;
  try {
    const response = await axios.get(`${API_URL}&page=${pageNum}`);
    return {
      movies: response.data.results,
      hasMore: pageNum < response.data.total_pages
    };
  } catch (error) {
    console.error(error);
    return {
      movies: [],
      hasMore: false
    };
  }
};

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [scrollYPosition] = useState(new Animated.Value(0));
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMovies = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const { movies: newMovies, hasMore: newHasMore } = await fetchMovies(sortOption, page);
    setMovies(prevMovies => page === 1 ? newMovies : [...prevMovies, ...newMovies]);
    setFilteredMovies(prevMovies => page === 1 ? newMovies : [...prevMovies, ...newMovies]);
    setHasMore(newHasMore);
    setLoading(false);
  }, [sortOption, page, loading]);

  useEffect(() => {
    setPage(1);
    loadMovies();
  }, [sortOption]);

  useEffect(() => {
    if (page > 1) {
      loadMovies();
    }
  }, [page]);

  const handleSortChange = (newSortOption: SortOption) => {
    if (newSortOption !== sortOption) {
      setSortOption(newSortOption);
      setMovies([]);
      setPage(1);
    }
  };

  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filteredData);
    } else {
      setFilteredMovies(movies);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity onPress={() => router.push(`/details/${item.id}`)}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}` }}
        style={styles.poster}
      />
    </TouchableOpacity>
  );

  return (
    <BasicLayout isView>
      <GradientHeader
        colors={['#E50914', '#b70710', theme.colors.behind]}
        scrollY={scrollYPosition}
      />
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={sortOption}
            style={styles.picker}
            onValueChange={(itemValue: SortOption) => handleSortChange(itemValue)}
          >
            <Picker.Item label="Popular" value="popular" />
            <Picker.Item label="Top Rated" value="top_rated" />
          </Picker>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a movie..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item: Movie) => item.id.toString()}
        numColumns={3}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#E50914" /> : null}
        contentContainerStyle={styles.flatListContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </BasicLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  poster: {
    width: 100,
    height: 150,
    margin: 5,
  },
  list: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  alignSelf:"flex-end"
  },
  sortLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    ...Platform.select({
      ios: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
      },
      android: {
        flex: 1,
      },
    }),
  },
  picker: {
    height: 50,
    borderRadius:10,
    ...Platform.select({
      android: {
        width: 150,
      },
    }),
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  imgLogo: {
    alignSelf: 'center',
  },
  flatListContainer: {
    alignItems: "center",
  },
  columnWrapper: {
    justifyContent: 'space-between',
  }
});
