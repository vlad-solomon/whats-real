for(i = 0; i < movieCards.length; i++){
    let card = $("<div>")

    movieCards[i].data = movieCards[i].title.toLowerCase().replace(/\s/g, '')
    
    card.addClass("card visible")
    card.attr("data-movie" , movieCards[i].data)
    
    let cardBackground = $(`<img src="assets/movies/${movieCards[i].data}/card.jpg" alt="${movieCards[i].data}" class="card__background">`);
    let cardTitle = $(`<span class="card__title">${movieCards[i].title}</span>`)
    
    cardTitle.appendTo(card)
    cardBackground.appendTo(card);
    
    card.appendTo(".cards__grid")
}

const search = $("#movie-search");
const closeSearch = $("#close-search");

search.keyup(function(){

    // Get value of the search field
    let searchValue = $("#movie-search").val();

    // Get card title innet text for every card
    $(".card span").each(function(){

        cardTitle = this.innerText.toLowerCase()
        
        // Compare all the card titles to the value
        // of the search field
        if(cardTitle.includes(searchValue)){
            $(this).parent().addClass("visible")
        } else{
            $(this).parent().removeClass("visible")
        }

        // If the search field is empty give all
        // the cards the class of visible
        if(searchValue == ""){
            $(".card").addClass("visible")
        }

    })

    if(searchValue.length > 0){
        closeSearch.attr("src" , "/assets/img/icons/close.svg");
        closeSearch.css("cursor" , "pointer");
        closeSearch.click(function(){
            closeSearch.attr("src" , "/assets/img/icons/search.svg");
            closeSearch.removeAttr("style")
            search.val("");
            $(".card").addClass("visible");
            $(".not-found").removeClass("visible")
        })
    } else{
        closeSearch.attr("src" , "/assets/img/icons/search.svg")
    }

    if(!$(".card").hasClass("visible")){
        $(".not-found").addClass("visible")
    } else{
        $(".not-found").removeClass("visible")
    }

})

const movieContainer = $(".movie-page-container");
const html = $("html");
const body = $("body");

let moviesArray = movieCards.map(({data}) => data)

$(".card").click(function(){

    let movie = $(this).data("movie");

    $("body > div:not(.movie-page-container)").addClass("fade-out")
    
    let movieDetails = $(`<script src="/assets/movies/${movie}/${movie}.js"></script>`)
    setTimeout(function(){
        movieDetails.appendTo(body)
        openMoviePage(movie);
    })
})

$("#random").click(function(){
    let randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)]
    $("body > div:not(.movie-page-container)").addClass("fade-out")
    setTimeout(function(){
        body.append(`<script src="/assets/movies/${randomMovie}/${randomMovie}.js"></script>`)
        openMoviePage(randomMovie)
    })
})

function openMoviePage(movie){

    html.css("overflow" , "hidden");
    body.css("overflow" , "hidden");
    
    movieContainer.load("/assets/movies/movie-template.html", function(){

        setTimeout(function(){
            $(".header").addClass("visible");
            $(".movie-page").addClass("visible")
            movieContainer.css("z-index" , "1");
        }, 1000)
        
        setTimeout(function(){
            $(".movie-page").css("pointer-events" , "auto");
            movieContainer.css("overflow-y" , "auto");
        }, 2500)
        
        $("#back, #back-to-homepage").click(function(){
            closeMoviePage();
        });

        $("#open-trailer").click(function(){
            movieContainer.css("overflow-y" , "hidden");
            $(".trailer").css({
                "opacity" : "1",
                "pointer-events" : "auto"
            })
        });

        $("#close-trailer").click(function(){
            movieContainer.css("overflow-y" , "auto");
            $(".trailer").removeAttr("style")

            let trailerSrc = $("iframe").attr("src");
            $("iframe").attr("src" , "")
            $("iframe").attr("src" , trailerSrc)
        })

        populateMoviePage(movie);
        rateMovie();

        if($(window).width() <= 1050){
            setTimeout(function(){
                initalizeActorsCarousel();
            }, 2500)
        }

    });
}

function initalizeActorsCarousel(){
    $(".main-carousel").flickity({
        cellAlign: "left",
        freeScroll: true,
        contain: true,
        pageDots: false,
        prevNextButtons: false,
    });
}


$(window).resize(function(){
    if($(window).width() >= 1050 && $(".main-carousel").hasClass("flickity-enabled")){
        $(".main-carousel").flickity("destroy")
    } else if($(window).width() <= 1050 && !$(".main-carousel").hasClass("flickity-enabled")){
        initalizeActorsCarousel();
    }
})

function populateMoviePage(movie){

    let embedOptions = `?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white&disablekb=1" frameborder="0"`

    $("iframe").attr("src" , `${trailer.link}${embedOptions}`)
    $(".trailer__title").text(`${trailer.title}`)
    
    const movieHeader = $(".header")
    movieHeader.attr("src" , `/assets/movies/${movie}/header.png`)
    
    $(".movie-details__title").text(title);
    $(".movie-details__description").text(summary);

    for(i = 0; i < directors.length; i++){
        let director = $(`<span>${directors[i]}</span>`);
        director.appendTo($(".directors"))
        if(directors.length > 1){
            $(".directors span:first-child").text("Directors");
        }
    }

    for(i = 0; i < writers.length; i++){
        let writer = $(`<span>${writers[i]}</span>`);
        writer.appendTo($(".writers"))
        if(writers.length > 1){
            $(".writers span:first-child").text("Writers");
        }
    }

    for(i = 0; i < actors.length; i++){

        const actorsContainer = $(".actors");
    
        actors[i].image = actors[i].name.toLowerCase().replace(/\s/g, '');
    
        let actorCard = $("<div>");
        actorCard.addClass("actors__card carousel-cell");
    
        let actorName = $(`<span class="actors__role">${actors[i].name} is ${actors[i].role}</span>`);
        let actorImage = $(`<img src="/assets/movies/${movie}/actors/${actors[i].image}.jpg" class="actors__image" alt="${actors[i].image}">`)
    
        actorName.appendTo(actorCard)
        actorImage.appendTo(actorCard)
    
        actorCard.appendTo(actorsContainer)
    }
    
    for(i = 0; i < scenes.length; i++){
    
        const scenesContainer = $(".scenes");
    
        let sceneCard = $("<div>");
        sceneCard.addClass("movie-scene");
    
        let sceneName = $(`<span class="movie-scene__title">${scenes[i].name}</span>`)
        let sceneImage = $(`<img src="/assets/movies/${movie}/scenes/${i}.jpg" class="movie-scene__image" alt="${i}">`)
        let sceneDescription = $(`<span class="movie-scene__description">${scenes[i].description}</span>`);
    
        sceneName.appendTo(sceneCard);
        sceneImage.appendTo(sceneCard)
        sceneDescription.appendTo(sceneCard);
    
        sceneCard.appendTo(scenesContainer)
    
    }

    for(i = 0; i < trivia.length; i++){
        let triviaSpan = $(`<span>${trivia[i]}</span>`)
        triviaSpan.appendTo($(".trivia"))
    }

    for(i = 0; i < quotes.length; i++){

        const quoteContainer = $("<div>")
        quoteContainer.addClass("quote")

        let quoteMain = $(`<span class="quote__main">${quotes[i].quote}</span>`)
        let quotePerson = $(`<span class="quote__person">${quotes[i].person}</span>`)

        quoteMain.appendTo(quoteContainer)
        quotePerson.appendTo(quoteContainer)

        quoteContainer.appendTo($(".quotes"))

    }
}

function closeMoviePage(){

    // reset the search field and the cards
    // if the user searched for a movie

    search.val("")
    closeSearch.attr("src" , "/assets/img/icons/search.svg");
    closeSearch.removeAttr("style")
    $(".card").addClass("visible")

    movieContainer.css("overflow" , "hidden");
    $(".movie-page").css("pointer-events" , "none");
    $(".header").removeClass("visible")
    $(".movie-page").removeClass("visible")

    setTimeout(function(){
        html.removeAttr("style")
        body.removeAttr("style")
        movieContainer.removeAttr("style");
        movieContainer.children().remove();
        $("body > div:not(.movie-page-container)").removeClass("fade-out").addClass("fade-in")
        $("script").last().remove();
    }, 1500)
    
    setTimeout(function(){
        $("body > div:not(.movie-page-container)").removeClass("fade-in")
    }, 2500)

}

function rateMovie(){

    let ratingWidth = parseInt($(".movie-details__rating").css("width"))
    let ratingScore = (rating * ratingWidth) / 10

    $(".movie-details__score").css("width" , `${ratingScore}px`)
    
}