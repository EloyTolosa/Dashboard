import { Request, Alert } from './modules/helpers.js';
import { ApiURL, ApiKey, DiscoverMoviesURL, SearchMoviesURL, ListMovieGenres } from './modules/constants.js';

$("#discoverMovieByYearBtn").click(
    loadMoviesByYear()
)

$("#discoverMovieByTextBtn").click(
    getMoviesBySimilarText()
)

// Load piechart with %movies by genre
$(document).ready(
    loadMoviePercentagePerGenre()
);

function loadMoviesByYear() {
    
    var moviesByYear = getMoviesByYear()
    moviesByYear.then(
        function(response) {
            console.log(response)
        },
        function(error) {
            Alert("movieByYear.click()", error)
        }
    )

    return false
}

function loadMoviePercentagePerGenre() {

    // load data from api
    var moviesByGenrePromise = getMoviesByGenre()
    moviesByGenrePromise.then(
        // successful
        function (moviesByGenre) {
            // console.log(moviesByGenre)

            // load highcharts
            Highcharts.chart('container', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Percentage of movies based on genre'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: moviesByGenre,
                }]
            });
        },
        function (error) {
            Alert("loadMoviePercentagePerGenre", error)
        }
    )

    return false
}

async function getMoviesByGenre() {

    var perMoviesByGenre = []
    var totalMovies = 0

    // get all genres
    var url = ApiURL + ListMovieGenres + "?" + "api_key=" + ApiKey
    var req = await Request(url, "GET")

    // waits for the request to finish
    var genres = req.genres
    // get number of movies by genre id
    for (let i = 0; i < genres.length; i++) {

        const genreId = genres[i].id
        const genreName = genres[i].name
        const url = ApiURL + DiscoverMoviesURL + "?" + "with_genres=" + genreId + "&api_key=" + ApiKey

        var movies = await Request(url, "GET")
        perMoviesByGenre.push({
            name: genreName,
            y: movies.total_results,   // We'll later divide it by the total number of movies
            // across all genres
        })
        totalMovies += movies.total_results

    }

    for (let i = 0; i < perMoviesByGenre.length; i++) {
        perMoviesByGenre[i].y /= totalMovies
    }

    return perMoviesByGenre
}

async function getMoviesByYear() {
    var year = $("#discoverMovieByYearInput").val() // NOTE: val() will return a sttring

    if (year == null || year === "") {
        Alert("getMoviesByYear", "Please introduce a year")
        return false
    }
    // NOTE: add default params constant like "language", "exclude adult content", etc.
    // NOTE: create URL object with API key added
    // NOTE: add function to set the sub-url (searchMovies, searchPeople)
    // NOTE: add function to add params to URL 
    var url = ApiURL + DiscoverMoviesURL + "?" + "year=" + year + "&api_key=" + ApiKey
    return await Request(url, "GET")
}

function getMoviesBySimilarText() {
    var query = $("#discoverMovieByTextInput").val()

    if (query === "") {
        Alert("getMoviesBySimilarText", "Please introduce a text to search movies with")
        return false
    }

    var url = ApiURL + SearchMoviesURL + "?" + "query=" + text + "&api_key=" + ApiKey
    return Request(url, "GET")
}