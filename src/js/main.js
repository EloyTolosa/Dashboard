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
    getMoviesByGenre()
);

function loadMoviePercentagePerGenre() {

    // load data from api

    // present data to highchard
    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Browser market shares in May, 2020'
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
        series: data
    });
}

function getMoviesByGenre() {


    
    // get all genres
    var url = ApiURL + ListMovieGenres + "?" + "api_key=" + ApiKey
    var req = Request(url, "GET", null, null, null)
    req.done(function (data) {
        var genres = data.genres
        // get number of movies by genre id
        for (let i = 0; i < genres.length; i++) {

            var genreId = genres[i].id
            var genreName = genres[i].name
            var url = ApiURL + DiscoverMoviesURL + "?" + "with_genres=" + genreId + "&api_key=" + ApiKey
            var req = Request(url, "GET", null, null, null)
            req.done(function (data) {
                console.log("There are " + data.total_results + " belonging to the genre " + genreName)
            })

            return false

        }

    })

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
    return Request(url, "GET", null, null, null)
}

function getMoviesBySimilarText() {
    var query = $("#discoverMovieByTextInput").val()

    if (query === "") {
        Alert("getMoviesBySimilarText", "Please introduce a text to search movies with")
        return false
    }

    var url = ApiURL + SearchMoviesURL + "?" + "query=" + text + "&api_key=" + ApiKey
    return Request(url, "GET", null, null, null)
}