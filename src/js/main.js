import { Request, Alert } from './modules/helpers.js';
import { ApiURL, ApiKey, DiscoverMoviesURL, SearchMoviesURL, ListMovieGenres } from './modules/constants.js';

$("#discoverMovieByYearBtn").click(function () {
    getMoviesByYear()
})

$("#discoverMovieByTextBtn").click(function () {
    getMoviesBySimilarText()
})

// Load piechart with %movies by genre
$(document).ready(
    loadMoviePercentagePerGenre()
);

function loadMoviePercentagePerGenre() {

    // load data from api
    var moviesByGenre = getMoviesByGenre()

    // console.log(moviesByGenre)

    // transform into highcharts series notation
    moviesByGenre = moviesByGenre.map(function(object) {
        object.name = object.genreName
        delete object.genreName

        object.y = object.percentageMovies
        delete object.percentageMovies
    })

    console.log(moviesByGenre)

    // present data to highchard
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
        series: moviesByGenre
    });
}

function getMoviesByGenre() {

    var perMoviesByGenre = []
    var totalMovies = 0
    
    // get all genres
    var url = ApiURL + ListMovieGenres + "?" + "api_key=" + ApiKey
    var req = Request(url, "GET", null, null, null)
    req.done(function (data) {
        var genres = data.genres
        // get number of movies by genre id
        for (let i = 0; i < genres.length; i++) {

            const genreId = genres[i].id
            const genreName = genres[i].name
            const url = ApiURL + DiscoverMoviesURL + "?" + "with_genres=" + genreId + "&api_key=" + ApiKey

            var movies = Request(url, "GET", null, null, null)
            movies.done(function (data) {
                // console.log("There are " + data.total_results + " belonging to the genre " + genreName)
                perMoviesByGenre.push({
                    genreName: genreName,
                    percentageMovies: data.total_results,   // We'll later divide it by the total number of movies
                                                            // across all genres
                })
                totalMovies += data.total_results

                // console.log(totalMovies)
            })

        }

        for (let i = 0; i < perMoviesByGenre.length; i++) {
            // console.log(totalMovies)
            perMoviesByGenre[i].percentageMovies /= totalMovies
            // console.log(perMoviesByGenre[i])
        }
    })
    
    return perMoviesByGenre

}

function getMoviesByYear() {
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
    return Request(url, "GET")
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