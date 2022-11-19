// TODO fill with requests functions
export {
    moviesBySimilarTextRequest, moviesByYearRequest, moviesPerRevenueRequest, movieInfoRequest, getGenres,
    moviesByGenreRequest, moviesByGenreAndReleaseDatesRequest, movieImagesByMovieIDRequest, movieCastByMovieIDRequest,
    actorImageByActorIDRequest
}

import { Request, Alert } from './modules/helpers.js';
import {
    ApiURL, ApiKey, GetMovieImages, DiscoverMoviesURL, SearchMoviesURL, ListMovieGenres, GetMovieInfo,
    GetMovieCredits, GetPeopleImages
} from './modules/constants.js';

function moviesBySimilarTextRequest(query) {
    if (query === "") {
        Alert("getMoviesBySimilarText", "Please introduce a text to search movies with")
        return false
    }

    var url = ApiURL + SearchMoviesURL + "?" + "query=" + query + "&api_key=" + ApiKey
    return Request(url, "GET")
}

function movieInfoRequest(movieID) {
    if (movieID == "") {
        Alert("movieInfoRequest", "movieID must be non-empty")
    }

    const url = ApiURL + GetMovieInfo.replace("{movie_id}", movieID) + "?" + "&api_key=" + ApiKey
    return Request(url, "GET")
}

function getGenres() {
    // get all genres
    var url = ApiURL + ListMovieGenres + "?" + "api_key=" + ApiKey
    return Request(url, "GET")
}

function movieImagesByMovieIDRequest(movieID) {
    if (movieID === "" || movieID == null) {
        Alert("getMovieImagesByMovieID", "movieID is null")
    }

    var url = ApiURL + GetMovieImages.replace("{movie_id}", movieID) + "?api_key=" + ApiKey
    return Request(url, "GET")
}

function movieCastByMovieIDRequest(movieID) {
    if (movieID === "" || movieID == null) {
        Alert("movieCastByMovieIDRequest", "movieID is null")
    }

    var url = ApiURL + GetMovieCredits.replace("{movie_id}", movieID) + "?api_key=" + ApiKey
    return Request(url, "GET")
}

function actorImageByActorIDRequest(actorID) {
    if (actorID === "" || actorID == null) {
        Alert("actorImageByActorIDRequest", "actorID is null")
    }

    var url = ApiURL + GetPeopleImages.replace("{person_id}", actorID) + "?api_key=" + ApiKey
    return Request(url, "GET")
}

// DISCOVER URL REQUESTS


function moviesByGenreAndReleaseDatesRequest(genreId, release_date_from = "", release_date_to = "") {
    var fromFilter = ""
    if (release_date_from != "") {
        fromFilter = `&release_date.gte=${release_date_from}`
    }

    var toFilter = ""
    if (release_date_to != "") {
        toFilter = `&release_date.lte=${release_date_to}`
    }

    const url = ApiURL + DiscoverMoviesURL + "?" + fromFilter + toFilter + "&with_genres=" + genreId + "&api_key=" + ApiKey
    return Request(url, "GET")
}


function moviesByGenreRequest(genre) {
    const url = ApiURL + DiscoverMoviesURL + "?" + "with_genres=" + genre.id + "&api_key=" + ApiKey
    return Request(url, "GET")
}

function moviesByYearRequest(year) {
    if (year == null || year === "") {
        Alert("getMoviesByYear", "Please introduce a year")
        return false
    }
    // NOTE: add default params constant like "language", "exclude adult content", etc.
    // NOTE: create URL object with API key added
    // NOTE: add function to set the sub-url (searchMovies, searchPeople)
    // NOTE: add function to add params to URL 
    var url = ApiURL + DiscoverMoviesURL + "?" + "primary_release_year=" + year + "&api_key=" + ApiKey
    return Request(url, "GET")
}

function moviesPerRevenueRequest() {
    const url = ApiURL + DiscoverMoviesURL + "?" + "sort_by=revenue.desc" + "&api_key=" + ApiKey
    return Request(url, "GET")
}