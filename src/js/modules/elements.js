export { NewCard }

//TODO: add genre, actors, release date... BUT LATER
function NewCard(cardTitle, imagePath, imageAlt, cardText, releaseDate, info = {}) {
    return `<div class="card border-info mb-3" id="movieInfoCard" style="max-width: 18rem;">
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