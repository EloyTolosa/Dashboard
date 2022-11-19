export { NewCard, NewCastList }

//TODO: add genre, actors, release date... BUT LATER
//TODO: add vote_count, rating, popularity
function NewCard(cardTitle, imagePath, imageAlt, cardText, releaseDate, cast = []) {
    return `<div class="card border-info mb-3" id="movieInfoCard"> 
        <ul class="nav nav-tabs">
        <li class="nav-item">
            <button type="button" class="nav-link active" id="navLinkMovieInfo">Movie info</button>
        </li>
        <li class="nav-item">
            <button type="button" class="nav-link" id="navLinkMovieCast">Cast</button>
        </li>
    </ul>
    <div class="row no-gutters" id="movieCardBody">
        <img class="card-img-top" src="${imagePath}" alt="${imageAlt}" id="cardMovieImage">
        <div class="card-body">
            <h5 class="card-title">${cardTitle}</h5>
            <p class="card-text"><small class="text-muted">${releaseDate}</small></p>
            <p class="card-text">${cardText}</p>
        </div>
    </div>
    </div> `
}

function NewCastList(cast) {
    var castList = $('<ul/>').addClass("list-group border border-info").attr("id", "moviesList")
    cast.forEach(actor => {
        castList.append(NewActor(actor.name, actor.character, actor.image))
    });
    return castList.html()
}

function NewActor(actorName, actorCharacter, imagePath) {
    return `<div class="media">
    <img class="mr-3" src="${imagePath}" alt="${actorName} picture">
    <div class="media-body">
      <h5 class="mt-0">${actorName}</h5>
      ${actorCharacter}
    </div>
  </div>`
}