export { ApiKey, ApiToken, ApiURL, DiscoverMoviesURL, SearchMoviesURL, ListMovieGenres, GetMovieImages, GetMovieInfo, ImagesApiUrl }

const ApiToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzMxNzY5YjlhMzc3Yjk2YTIxODZkNzk4MWI2YzcyYiIsInN1YiI6IjYzNzEwYTJhY2E0ZjY3MDBjNjhkZjhmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hEvEVpOY4OPiZqbf6NbF4cXOXs_jadJzscr1PS24JkA"
const ApiKey = "5c31769b9a377b96a2186d7981b6c72b"
const ApiURL = "https://api.themoviedb.org/3/"
const ImagesApiUrl = "https://image.tmdb.org/t/p/original/"

// NOTE: they'll all start WITHOUT /
const DiscoverMoviesURL = "discover/movie"
const SearchMoviesURL = "search/movie"

const ListMovieGenres = "genre/movie/list"

const GetMovieInfo = "movie/{movie_id}"
const GetMovieImages = "movie/{movie_id}/images"

