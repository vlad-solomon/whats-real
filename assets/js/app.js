initializeCardGrid();

function initializeCardGrid(){

    // Create and append cards to the card grid 
    // for every movie title from the movieCards array

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
    
}

const search = $("#movie-search");
const closeSearch = $("#close-search");

search.keyup(function(){

    // Search through the card grid everytime the
    // value of the search field is updated

    fuzzySearch();
})

function fuzzySearch(){
    
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

    // Show or hide the clear search button depending on the
    // value of the search field

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

    // Show "not found" card when no card has the class of visible

    if(!$(".card").hasClass("visible")){
        $(".not-found").addClass("visible")
    } else{
        $(".not-found").removeClass("visible")
    }

}

const movieContainer = $(".movie-page-container");
const html = $("html");
const body = $("body");
const initialTitle = document.title

$(".card").click(function(){

    // Open the movie template page and animte out the homepage
    
    $("body > div:not(.movie-page-container)").addClass("fade-out")
    
    let movie = $(this).data("movie");
    openMoviePage(movie)

})

let moviesArray = movieCards.map(({data}) => data)

$("#random").click(function(){

    // Select a random movie from the moviesArray and load it
    // into the movie template

    let randomMovie = moviesArray[Math.floor(Math.random() * moviesArray.length)]

    $("body > div:not(.movie-page-container)").addClass("fade-out")
    openMoviePage(randomMovie)

})

function openMoviePage(movie){

    html.css("overflow" , "hidden");
    body.css("overflow" , "hidden");
    
    movieContainer.load("assets/movies/movie-template.html", function(){


        // Get all the data fron the selected movie's JSON
        // and populate the movie template page

        populateMoviePage(movie)
        
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

            stopTrailer();

            function stopTrailer(){
                const iframes = $("iframe");
                Array.prototype.forEach.call(iframes, iframe =>{
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: "command",
                        func: "stopVideo",
                    }),
                    "*"
                    );
                })
            }

        })

        if($(window).width() <= 1050){
            setTimeout(function(){
                initalizeActorsCarousel();
            }, 2500)
        }

    });

}

function populateMoviePage(movie){

    $.ajax({ 
        type: 'GET', 
        url: `assets/movies/${movie}/${movie}.json`, 
        dataType: 'json',
        timeout: 30000,
        success: function (details) {

            document.title = `What's Real about ${details.title}?`

            let ratingWidth = parseInt($(".movie-details__rating").css("width"))
            let ratingScore = (details.rating * ratingWidth) / 10

            $(".movie-details__score").css("width" , `${ratingScore}px`)

            let embedOptions = `?enablejsapi=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white&disablekb=1" frameborder="0"`
            $("iframe").attr("src" , `${details.trailer.link}${embedOptions}`)
            $(".trailer__title").text(`${details.trailer.title}`)

            const movieHeader = $(".header")
            movieHeader.attr("src" , `/assets/movies/${movie}/header.png`)
            
            $(".movie-details__title").text(details.title);
            $(".movie-details__description").text(details.summary);

            for(i = 0; i < details.directors.length; i++){
                let director = $(`<span>${details.directors[i]}</span>`);
                director.appendTo($(".directors"))
                if(details.directors.length > 1){
                    $(".directors span:first-child").text("Directors");
                }
            }

            for(i = 0; i < details.writers.length; i++){
                let writer = $(`<span>${details.writers[i]}</span>`);
                writer.appendTo($(".writers"))
                if(details.writers.length > 1){
                    $(".writers span:first-child").text("Writers");
                }
            }

            for(i = 0; i < details.actors.length; i++){

                const actorsContainer = $(".actors");
            
                details.actors[i].image = details.actors[i].name.toLowerCase().replace(/\s/g, '');
            
                let actorCard = $("<div>");
                actorCard.addClass("actors__card carousel-cell");
            
                let actorName = $(`<span class="actors__role">${details.actors[i].name} is ${details.actors[i].role}</span>`);
                let actorImage = $(`<img src="/assets/movies/${movie}/actors/${details.actors[i].image}.jpg" class="actors__image" alt="${details.actors[i].image}">`)
            
                actorName.appendTo(actorCard)
                actorImage.appendTo(actorCard)
            
                actorCard.appendTo(actorsContainer)
            }

            for(i = 0; i < details.scenes.length; i++){

                const scenesContainer = $(".scenes");
            
                let sceneCard = $("<div>");
                sceneCard.addClass("movie-scene");
            
                let sceneName = $(`<span class="movie-scene__title">${details.scenes[i].name}</span>`)
                let sceneImage = $(`<img src="/assets/movies/${movie}/scenes/${i}.jpg" class="movie-scene__image" alt="${i}">`)
                let sceneDescription = $(`<span class="movie-scene__description">${details.scenes[i].description}</span>`);
            
                sceneName.appendTo(sceneCard);
                sceneImage.appendTo(sceneCard)
                sceneDescription.appendTo(sceneCard);
            
                sceneCard.appendTo(scenesContainer)
            
            }

            for(i = 0; i < details.trivia.length; i++){
                let triviaSpan = $(`<span>${details.trivia[i]}</span>`)
                triviaSpan.appendTo($(".trivia"))
            }

            for(i = 0; i < details.quotes.length; i++){

                const quoteContainer = $("<div>")
                quoteContainer.addClass("quote")
        
                let quoteMain = $(`<span class="quote__main">${details.quotes[i].quote}</span>`)
                let quotePerson = $(`<span class="quote__person">${details.quotes[i].person}</span>`)
        
                quoteMain.appendTo(quoteContainer)
                quotePerson.appendTo(quoteContainer)
        
                quoteContainer.appendTo($(".quotes"))
        
            }

            // Animate in the movie page

            setTimeout(function(){
                $(".header").addClass("visible");
                $(".movie-page").addClass("visible")
                movieContainer.css("z-index" , "1");
            }, 1000)
            
            setTimeout(function(){
                $(".movie-page").css("pointer-events" , "auto");
                movieContainer.css("overflow-y" , "auto");
            }, 2500)
            
        },
        error: function(){

            document.title = "This is embarrassing!"

            movieContainer.load("/assets/movies/error-not-found.html" , function(){
                $("#error-return").click(function(){
                   window.location.reload();
                })
                setTimeout(function(){
                    $(".error-not-found").addClass("fade-in")
                }, 500)
            })
            setTimeout(function(){
                movieContainer.css("z-index" , "1")
            }, 1500)
        }

    });

}

function initalizeActorsCarousel(){

    // Carousel properties

    $(".main-carousel").flickity({
        cellAlign: "left",
        freeScroll: true,
        contain: true,
        pageDots: false,
        prevNextButtons: false,
    });

}


$(window).resize(function(){

    // Enable or disable the actors carousel functionality
    // depending on the browser window width

    if($(window).width() >= 1050 && $(".main-carousel").hasClass("flickity-enabled")){
        $(".main-carousel").flickity("destroy")
    } else if($(window).width() <= 1050 && !$(".main-carousel").hasClass("flickity-enabled")){
        initalizeActorsCarousel();
    }

})

function closeMoviePage(){

    // Reset everything back to normal when the close button is clicked

    document.title = initialTitle

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
    }, 1500)
    
    setTimeout(function(){
        $("body > div:not(.movie-page-container)").removeClass("fade-in")
    }, 2500)

}