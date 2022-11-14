import { Request, Alert } from './modules/helpers.js';
import { ApiURL, ApiKey, DiscoverMoviesURL } from './modules/constants.js';

$("#searchMovieByYearBtn").click(function(){
    var year = $("#searchMovieByYearInput").val()
    getMoviesByYear(year)
    return false
})

function getMoviesByYear(year) {
    if (year == null) {
        Alert("getMoviesByYear", "year was null")
        return false
    }
    // NOTE: add default params constant like "language", "exclude adult content", etc.
    // NOTE: create URL object with API key added
    // NOTE: add function to set the sub-url (searchMovies, searchPeople)
    // NOTE: add function to add params to URL 
    var url = ApiURL+DiscoverMoviesURL+"?"+"year="+year+"&api_key="+ApiKey
    var req = Request(url, "GET", null, null, null)

    return req
}