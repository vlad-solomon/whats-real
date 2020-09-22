for(i = 0; i < movieCards.length; i++){
    let card = $("<div>")

    movieCards[i].data = movieCards[i].title.toLowerCase().replace(/\s/g, '')
    
    card.addClass("card visible")
    card.attr("data-movie" , movieCards[i].data)
    
    let cardBackground = $("<img src='assets/img/temp/"+movieCards[i].data+".png' alt="+movieCards[i].data+" class='card__background'>");
    let cardTitle = $("<span class='card__title'>"+movieCards[i].title+"</span>")
    
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
            $("#movie-search").val("");
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