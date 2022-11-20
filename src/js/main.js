import { Alert, getObjectFromLocalStorage, pad } from './modules/helpers.js';
import { ImagesApiUrl } from './modules/constants.js';
import { NewCard, NewCastList } from './modules/elements.js';
import {
    moviesBySimilarTextRequest, moviesByYearRequest, moviesPerRevenueRequest, movieInfoRequest, getGenres,
    moviesByGenreRequest, moviesByGenreAndReleaseDatesRequest, movieImagesByMovieIDRequest, movieCastByMovieIDRequest, actorImageByActorIDRequest
} from './requests.js'

$("#discoverMovieByYearBtn").click(
    loadMoviesByYear
)

// TODO: use load* function
// $("#discoverMovieByTextBtn").click(
//     getMoviesBySimilarText
// )

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

async function getCastDataFromMovieID(movieID) {

    // get cast data
    var movieCastRequest = await movieCastByMovieIDRequest(movieID)
    var cast = movieCastRequest.cast.map(function (actor) {
        // get actor images and return
        // {actor_name, actor_role, actor_immage_request}
        // then we get the request and get the image
        return {
            name: actor.name,
            character: actor.character,
            image: actorImageByActorIDRequest(actor.id)
        }
    });

    for (let i = 0; i < cast.length; i++) {
        const actor = cast[i];
        var imageReq = await actor.image
        actor.image = (imageReq.profiles.length > 0) ? (ImagesApiUrl + imageReq.profiles[0].file_path) : ""
    }

    console.log(cast)

    // set movie info link inactive and
    // set the movie cast link active
    $("#navLinkMovieInfo").removeClass("active")
    $("#navLinkMovieCast").addClass("active")

    // insert into HTML
    $("#movieCardBody").empty()
    $("#movieCardBody").append(NewCastList(cast))
}

async function getMovieInfoFromMovie(movie) {
    // get image path from endpoint
    // TODO: add carroussel
    var movieImageRequest = await getObjectFromLocalStorage(`getMovieInfoFromMovie.${movie.id}`, movieImagesByMovieIDRequest, movie.id)

    var imagePath = movieImageRequest.backdrops[0].file_path.replace("./", "")
    var imagePath = ImagesApiUrl + imagePath

    var movieTitle = movie.original_title
    var movieReleaseDate = movie.release_date
    var movieOverview = movie.overview

    // set movie cast link inactive and
    // set the movie info link active
    $("#navLinkMovieInfo").removeClass("active")
    $("#navLinkMovieCast").addClass("active")

    // create movie card
    // TODO: move cardHTML to another module
    // TODO: add image with .replace() function
    $("#movieInfoCol").empty()
    $("#movieInfoCol").append(
        NewCard(movieTitle, imagePath, movieTitle + " movie image", movieOverview, movieReleaseDate)
    )
}

// TODO: load data from local cache once loaded
async function loadMovieInfoOnClick(event) {

    // load movie information with movie title
    var movieTitle = event.currentTarget.innerHTML
    var movieInfoResponse = await getObjectFromLocalStorage(`loadMovieInfoOnClick.${movieTitle}`, moviesBySimilarTextRequest, movieTitle)

    var movie = movieInfoResponse.results[0]

    // NOTE: I think we do not need to 'await' here 
    await getMovieInfoFromMovie(movie)

    $("#navLinkMovieCast").click(function () {
        getCastDataFromMovieID(movie.id)
    })
    $("#navLinkMovieInfo").click(function () {
        getMovieInfoFromMovie(movie)
    })

}


async function loadMoviesPerRevenue() {

    var data = await getObjectFromLocalStorage('loadMoviesPerRevenue', getMoviesPerRevenue)

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

async function getAllMoviesByYearRequests(year) {
    var requests = []
    requests.push(moviesByYearRequest(year))

    const maxPages = 250
    var req = await requests[0]
    for (let i = 1; i < req.total_pages && i < maxPages; i++) {
        requests.push(moviesByYearRequest(year, i + 1))
    }

    return requests
}

async function getAllMoviesByYear(year) {
    var requests = await getAllMoviesByYearRequests(year)
    for (let i = 0; i < requests.length; i++) {
        requests[i] = (await requests[i]).results.map(function(result) {
            return result.original_title
        })
    }

    return requests
}


async function loadMoviesByYear() {

    var year = $("#discoverMovieByYearInput").val() // NOTE: val() will return a sttring
    // key of the localstorage has to be loadMoviesByYear.{year} so the key does not repeat
    var responses = await getObjectFromLocalStorage(`loadMoviesByYear.${year}`, getAllMoviesByYear, year)

    // first empty the moviesList before entering new values
    $("#moviesList").empty()
    // then, add buttons
    for (let i = 0; i < responses.length; i++) {
        const response = /*await*/ responses[i];
        response.forEach(element => {
            var listElement = '<button type="button" class="list-group-item list-group-item-action">' + element + '</button>'
            $("#moviesList").append(listElement)
        })
    }


    // finally add button click listeners
    $("button.list-group-item").click(loadMovieInfoOnClick)

}

async function loadMoviesPerYear() {

    // get data
    var data = await getObjectFromLocalStorage('loadMoviesPerYear', getMoviesPerYear, 2010, 1)

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

}

async function getDataFromGenreID(genreID, from, to, toLimit, increment) {
    var requests = []
    while (from <= toLimit) {

        const fromStr = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`
        const toStr = `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`

        requests.push(
            moviesByGenreAndReleaseDatesRequest(genreID, fromStr, toStr))

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

async function loadMoviePercentagePerGenre() {

    // we try to get the data from localStorage
    // if data exists, we just transform into an object
    // if data does not exist in localStorage, we load it from the API
    // and then we store it in the localStorage
    var moviesByGenre = await getObjectFromLocalStorage(
        'loadMoviePercentagePerGenre', getMoviesByGenre)

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

    return false
}

async function getMoviesByGenre() {

    var perMoviesByGenre = []
    var totalMovies = 0

    var genresRequest = await getGenres()
    var genres = genresRequest.genres

    var requests = genres.map(function (genre) {
        return moviesByGenreRequest(genre)
    })

    for (let i = 0; i < requests.length; i++) {
        const request = await requests[i];
        perMoviesByGenre.push({
            name: genres[i].name,
            y: request.total_results,     // We'll later divide it by the total number of movies
            // across all genres
        })
        totalMovies += request.total_results
    }

    // transform to %
    for (let i = 0; i < perMoviesByGenre.length; i++) {
        perMoviesByGenre[i].y /= totalMovies
    }

    return perMoviesByGenre
}



// function loadMoviesBySimilarText() {
//     var query = $("#discoverMovieByTextInput").val()
//     var promise = getMoviesBySimilarText(query)
// }