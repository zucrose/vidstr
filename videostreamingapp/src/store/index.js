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
};
export const getGenres = createAsyncThunk("vidstr/genres", async () => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    // console.log(movie);
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });
    const rel=(movie.first_air_date)?movie.first_air_date:movie.release_date;
    if (movie.backdrop_path) {
      moviesArray.push({
        id: movie.id,
        type:movie.media_type,
        name: movie?.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
        synopsis:movie.overview,
        released:rel,
        
      });
    }
  });
};
const getRawData = async (api, genres, paging) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};
export const fetchDataByGenre = createAsyncThunk(
  "vidstr/trending",
  async ({ genre, type }, thunkApi) => {
    const {
      vidstr: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
      genres
    );
  }
);
export const fetchMovies = createAsyncThunk(
  "vidstr/moviesbygenre",
  async ({ type }, thunkApi) => {
    const {
      vidstr: { genres },
    } = thunkApi.getState();
    return getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );

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
    async ({movieId,email}) => {
      const {
        data: { movies },
      } = await axios.put(`http://localhost:5000/api/user/delete/`,{
        email,movieId
      });
      return movies;
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
      state.movies = action.payload;
    });
    builder.addCase(removeFromLikedMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});

export const store = configureStore({
  reducer: {
    vidstr: VidSlice.reducer,
  },
});
