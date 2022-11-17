import { Request, Alert } from './modules/helpers.js';
import { ApiURL, ApiKey, ImagesApiUrl, DiscoverMoviesURL, SearchMoviesURL, ListMovieGenres, GetMovieImages } from './modules/constants.js';
import { NewCard } from './modules/elements.js';

$("#discoverMovieByYearBtn").click(
    loadMoviesByYear
)

// TODO: use load* function
$("#discoverMovieByTextBtn").click(
    getMoviesBySimilarText
)

// Load piechart with %movies by genre
$(document).ready(
    loadMoviePercentagePerGenre()
);

function isScrollbarAtBottom() {
    var documentHeight = $(document).height();
    var scrollDifference = $(window).height() + $(window).scrollTop();
    return (documentHeight == scrollDifference);
}

$("#movieInfoCard").scroll(function () {
    console.log("scrolling ...")
})

// TODO
function loadMovieInfoOnClick(event) {

    // load movie information with movie title
    var movieTitle = event.currentTarget.innerHTML
    var promise = getMoviesBySimilarText(movieTitle)

    promise.then(
        //success
        function (movieInfoResponse) {
            console.log("Movie info", movieInfoResponse.results[0])

            var movie = movieInfoResponse.results[0]

            // get image path from endpoint
            var promise = getMovieImagesByMovieID(movie.id)

            promise.then(
                //success
                function (movieImageResponse) {

                    var imagePath = movieImageResponse.backdrops[0].file_path.replace("./", "")
                    var imagePath = ImagesApiUrl + imagePath

                    var movieTitle = movie.original_title
                    var movieReleaseDate = movie.release_date
                    var movieOverview = movie.overview

                    // create movie card
                    // TODO: move cardHTML to another module
                    // TODO: add image with .replace() function
                    $("#movieInfoCol").empty()
                    $("#movieInfoCol").append(
                        NewCard(movieTitle, imagePath, movieTitle + " movie image", movieOverview, movieReleaseDate)
                    )

                },
                // error
                function (error) {
                    console.log(error)
                }
            )
        },
        // error
        function (error) {
            Alert("loadMovieInfoOnClick", error)
        }
    )

}

async function getMovieImagesByMovieID(movieID) {
    if (movieID === "" || movieID == null) {
        Alert("getMovieImagesByMovieID", "movieID is null")
    }

    var url = ApiURL + GetMovieImages.replace("{movie_id}", movieID) + "?api_key=" + ApiKey
    return await Request(url, "GET")
}

function loadMoviesByYear() {

    var year = $("#discoverMovieByYearInput").val() // NOTE: val() will return a sttring
    var moviesByYearPromise = getMoviesByYear(year)
    moviesByYearPromise.then(
        function (response) {

            // first empty the moviesList before entering new values
            $("#moviesList").empty()
            response.results.forEach(element => {
                var listElement = '<button type="button" class="list-group-item list-group-item-action">' + element.original_title + '</button>'
                $("#moviesList").append(listElement)
            });

            // then add button click listeners
            $("button.list-group-item").click(loadMovieInfoOnClick)

            console.log(response)
        },
        function (error) {
            Alert("movieByYear.click()", error)
        }
    )

    return false
}

async function getMoviesPerYear() {

    // get list of all genres
    var genres = await getGenres()

    // search movies per genre and release date
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

function getGenres() {
    // get all genres
    var url = ApiURL + ListMovieGenres + "?" + "api_key=" + ApiKey
    return Request(url, "GET")
}

function getMovieNumberByGenre(genre) {
    const url = ApiURL + DiscoverMoviesURL + "?" + "with_genres=" + genre.id + "&api_key=" + ApiKey
    return Request(url, "GET")
}

async function getMoviesByGenre() {

    var perMoviesByGenre = []
    var totalMovies = 0

    var genresRequest = await getGenres()
    var genres = genresRequest.genres

    // get number of movies by genre id
    for (let i = 0; i < genres.length; i++) {
        var moviesRequest = await getMovieNumberByGenre(genres[i])

        // console.log(genres[i].name, movies.total_results)
        perMoviesByGenre.push({
            name: genres[i].name,
            y: moviesRequest.total_results,     // We'll later divide it by the total number of movies
                                                // across all genres
        })
        totalMovies += moviesRequest.total_results
    }

    // transform top %
    for (let i = 0; i < perMoviesByGenre.length; i++) {
        perMoviesByGenre[i].y /= totalMovies
    }

    return perMoviesByGenre
}

async function getMoviesByYear(year) {
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

function loadMoviesBySimilarText() {
    var query = $("#discoverMovieByTextInput").val()
    var promise = getMoviesBySimilarText(query)
}

async function getMoviesBySimilarText(query) {
    if (query === "") {
        Alert("getMoviesBySimilarText", "Please introduce a text to search movies with")
        return false
    }

    var url = ApiURL + SearchMoviesURL + "?" + "query=" + query + "&api_key=" + ApiKey
    return Request(url, "GET")
}