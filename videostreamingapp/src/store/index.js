import { async } from "@firebase/util";
import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  recommended: [],
};
export const getGenres = createAsyncThunk("vidstr/genres", async (type) => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres, mediatype) => {
  array.forEach((movie) => {
    const movieGenres = [];
    //  console.log(movie);
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    const rel = movie.first_air_date
      ? movie.first_air_date
      : movie.release_date;
    if (movie.backdrop_path) {
      moviesArray.push({
        id: movie.id,
        type: mediatype ? mediatype : movie.media_type,
        name: movie.title ? movie.title : movie.name,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
        synopsis: movie.overview,
        released: rel,
      });
    }
  });
};
const getRawData = async (api, genres, type, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres, type);
  }

  console.log(moviesArray);
  return moviesArray;
};
const CreateHomePage = async (genres) => {
  const moviesArray = [];

  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/trending/all/week?api_key=${API_KEY}`
    );
    createArrayFromRawData(results, moviesArray, genres);
  }

  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&vote_count.gte=1000&vote_average.gte=8`
    );
    createArrayFromRawData(results, moviesArray, genres, "movie");
  }
  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=10000&with_genres=10749`
    );
    createArrayFromRawData(results, moviesArray, genres, "movie");
  }
  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=10000&with_genres=14`
    );
    createArrayFromRawData(results, moviesArray, genres, "movie");
  }
  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&vote_count.gte=1000&vote_average.gte=8`
    );
    createArrayFromRawData(results, moviesArray, genres, "tv");
  }
  {
    const {
      data: { results },
    } = await axios.get(
      `${TMDB_BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=1000&with_genres=80`
    );
    createArrayFromRawData(results, moviesArray, genres, "tv");
  }
  // console.log(moviesArray);
  return moviesArray;
};
export const fetchDataByGenre = createAsyncThunk(
  "vidstr/moviesbygenre",
  async ({ genre, type }, thunkApi) => {
    const {
      vidstr: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&vote_count.gte=100&with_genres=${genre}`,
      genres,
      type,
      true
    );
  }
);
export const fetchMovies = createAsyncThunk(
  "vidstr/trending",
  async ({ type }, thunkApi) => {
    const {
      vidstr: { genres },
    } = thunkApi.getState();

    return CreateHomePage(genres);
    //return getRawData(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`)
  }
);
export const getUserLikedMovies = createAsyncThunk(
  "vidstr/getLiked",
  async (email) => {
    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
    return movies;
  }
);

export const removeFromLikedMovies = createAsyncThunk(
  "vidstr/deleteLiked",
  async ({ movieId, email }) => {
    const {
      data: { movies },
      msg,
    } = await axios.put(`http://localhost:5000/api/user/delete/`, {
      email,
      movieId,
    });
    console.log(msg);
    return movies;
  }
);
/*export const createRecommendedMovies = async (movie, moviesArray, genres) => {
  console.log(movie);
  const {
    data: { results },
  } = await axios.get(
    `${TMDB_BASE_URL}/${movie.type}/${movie.id}/similar?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=100`
  );
  console.log(results);
  const slicedlist = results.slice(0, 3);
  createArrayFromRawData(slicedlist, moviesArray, genres, movie.type);
  console.log(moviesArray);
};*/
export const getRecommended = createAsyncThunk(
  "vidstr/recommended",
  async ({ email }, thunkApi) => {
    console.log("recommended called", email);
    const {
      vidstr: { genres },
    } = thunkApi.getState();

    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/user/liked/${email}`);

    console.log(movies);
    const moviesArray = [];

    for (let i = 0; i < movies.length; i++) {
      //console.log(mov);
      let movie = movies[i];
      const {
        data: { results },
      } = await axios.get(
        `${TMDB_BASE_URL}/${movie.type}/${movie.id}/similar?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=100`
      );

      console.log(results);
      const slicedlist = results.slice(0, 3);
      createArrayFromRawData(slicedlist, moviesArray, genres, movie.type);
      //console.log(moviesArray);
    }

    console.log("final", moviesArray);
    return moviesArray;
  }
);

const VidSlice = createSlice({
  name: "Vidstr",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload || [];
    });
    builder.addCase(removeFromLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload || [];
    });
    builder.addCase(getRecommended.fulfilled, (state, action) => {
      //console.log(action);
      state.recommended = action.payload || [];
    });
  },
});

export const store = configureStore({
  reducer: {
    vidstr: VidSlice.reducer,
  },
});
