import { Alert, pad } from './modules/helpers.js';
import { ImagesApiUrl } from './modules/constants.js';
import { NewCard } from './modules/elements.js';
import {
    getMoviesBySimilarText, getMoviesByYear, moviesPerRevenueRequest, movieInfoRequest, getGenres,
    getMovieNumberByGenre, movieNumberByGenreRequest
} from './requests.js'

$("#discoverMovieByYearBtn").click(
    loadMoviesByYear
)

// TODO: use load* function
$("#discoverMovieByTextBtn").click(
    getMoviesBySimilarText
)

// Load piechart with %movies by genre
$(document).ready(function () {
    loadMoviePercentagePerGenre()
    loadMoviesPerYear()
    loadMoviesPerRevenue()
}
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


function loadMoviesPerRevenue() {

    var promise = getMoviesPerRevenue()
    promise.then(
        //success
        function (data) {

            Highcharts.chart('moviesPerRevenue', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Most revenue movies from all history'
                },
                subtitle: {
                    text: 'Source: <a href="https://developers.themoviedb.org/3" target="_blank">TMDB</a>'
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -90,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Revenue ($ millions)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Revenue: <b>{point.y:.1f} millions</b>'
                },
                series: [{
                    name: 'Revenue',
                    data: data,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        },
        // error
        function (error) {
            alert(error)
        }
    )
}

async function getMoviesPerRevenue() {
    var data = []

    // get top 25 movies ids per revenue desc
    var moviesPerRevenueReq = await moviesPerRevenueRequest()
    var movies = moviesPerRevenueReq.results

    for (let i = 0; i < movies.length; i++) {
        const movieID = movies[i].id;
        const movieTitle = movies[i].title

        // given the movie id, search for the revenue of the movie
        var movieRevenueRequest = await movieInfoRequest(movieID)
        var movieRevenue = movieRevenueRequest.revenue / 1000000

        data.push([movieTitle, movieRevenue])
    }

    console.log(data)

    return data
}

function loadMoviesByYear() {

    var year = $("#discoverMovieByYearInput").val() // NOTE: val() will return a sttring
    var moviesByYearPromise = getMoviesByYear(year)
    moviesByYearPromise.then(
        function (response) {

            // first empty the moviesList before entering new values
            $("#moviesList").empty()
            // then, add buttons
            response.results.forEach(element => {
                var listElement = '<button type="button" class="list-group-item list-group-item-action">' + element.original_title + '</button>'
                $("#moviesList").append(listElement)
            });

            // finally add button click listeners
            $("button.list-group-item").click(loadMovieInfoOnClick)

            console.log(response)
        },
        function (error) {
            Alert("movieByYear.click()", error)
        }
    )

    return false
}

function loadMoviesPerYear() {

    // get data
    var promise = getMoviesPerYear(2010, 1) // form 2010 increment of 1
    promise.then(
        // success
        function (data) {
            // put highchart
            Highcharts.chart('moviesPerYear', {

                title: {
                    text: 'Evolution of the amount of movies made by genre'
                },

                subtitle: {
                    text: 'Source: <a href="https://developers.themoviedb.org/3/getting-started/introduction" target="_blank">TMDB</a>'
                },
                yAxis: {
                    title: {
                        text: 'Number of movies'
                    }
                },

                xAxis: {
                    accessibility: {
                        rangeDescription: `Range: 2010 to 2022`
                    }
                },

                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 2010
                    }
                },

                series: data,

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });
        },
        // error
        function (error) {
            Alert("loadMoviesPerYear", error)
        }
    )



}

async function getDataFromGenreID(genreID, from, to, toLimit, increment) {
    var requests = []
    while (from <= toLimit) {

        const fromStr = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`
        const toStr = `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`

        console.log(fromStr, toStr)

        var req = movieNumberByGenreRequest(genreID, fromStr, toStr)
        requests.push(req)

        // append number of movies to mpy data
        // mpy.data.push(req.total_results)

        // from always sums up 'increment' times
        from.setFullYear(from.getFullYear() + increment)

        // in the case of 'to', we will sum 'increment' times
        // but only if the difference between the current 'to'
        // and the 'dateTo' variable is more than 'increment'
        // Otherwise, we will set the 'to' date to the 'dateTo'
        // date
        to.setFullYear(to.getFullYear() + increment)
        if (to > toLimit) {
            to = new Date(toLimit.getTime())
        }

    }
    return requests
}

async function getMoviesPerYear(startYear = 1960, inc = 5) {

    var series = []

    // get list of all genres
    var req = await getGenres()
    var genres = req.genres

    for (let i = 0; i < genres.length; i++) {

        const genre = genres[i];
        console.log("Processing genre", genre.name, "...")

        // search movies per genre and release date
        var increment = inc
        var dateFrom = new Date(`${startYear}-01-01`)
        var dateTo = new Date()

        var from = dateFrom

        var to = new Date(from.getTime())
        to.setFullYear(to.getFullYear() + increment)

        // series to return
        var mpy = {
            name: genre.name,
            data: [],
        }

        var dataRes = await getDataFromGenreID(genre.id, from, to, dateTo, increment)
        for (let i = 0; i < dataRes.length; i++) {
            const req = await dataRes[i];
            mpy.data.push(req.total_results)
        }

        series.push(mpy)
    }

    return series
}

function loadMoviePercentagePerGenre() {

    // load data from api
    var moviesByGenrePromise = getMoviesByGenre()
    moviesByGenrePromise.then(
        // successful
        function (moviesByGenre) {
            // console.log(moviesByGenre)

            // load highcharts
            Highcharts.chart('perMoviesByGenre', {
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



function loadMoviesBySimilarText() {
    var query = $("#discoverMovieByTextInput").val()
    var promise = getMoviesBySimilarText(query)
}