export { NewCard }

//TODO: add genre, actors, release date... BUT LATER
//TODO: add vote_count, rating, popularity
function NewCard(cardTitle, imagePath, imageAlt, cardText, releaseDate, info = {}) {
    return `<div class="card border-info mb-3" id="movieInfoCard"> 
        <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link active" href="#">Movie info</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#">Cast</a>
        </li>
    </ul>
    <div class="row no-gutters">
        <img class="card-img-top" src="${imagePath}" alt="${imageAlt}" id="cardMovieImage">
        <div class="card-body">
            <h5 class="card-title">${cardTitle}</h5>
            <p class="card-text"><small class="text-muted">${releaseDate}</small></p>
            <p class="card-text">${cardText}</p>
        </div>
    </div>
    </div> `
}