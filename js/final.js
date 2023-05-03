const pokemonList = [];

var index = 0;

const getPokemonType = (url, name) => {
    $.getJSON(url, function(response) {
        let type1 = firstLetterUpper(response.types[0].type.name);
        let type2 = "None";
        if (response.types.length == 2) {
            type2 = firstLetterUpper(response.types[1].type.name);
        }
        pokemonList.push({name: name, type1: type1, type2: type2});
        $('ul').append(`<li id="${type1}/${type2}">` + name + '</li>');
    });
}

const getPokemon = () => {
    $.getJSON("https://pokeapi.co/api/v2/pokemon?limit=151", function(response) {
        response.results.forEach(pokemon => {
            getPokemonType(pokemon.url, firstLetterUpper(pokemon.name));
        });
    });
}

const firstLetterUpper = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

getPokemon();

$(document).on('click', 'li', function() {
    $('li.selected').removeClass('selected');
    $(this).addClass('selected');
    $("#editor").css("opacity", "0");
    $("#editor").css("display", "inline-block");
    $("#editor").animate({opacity: 1}, 750);
    $("#nameToEdit").val(this.innerHTML);
    $("#type1").val(this.id.split("/")[0]);
    $("#type2").val(this.id.split("/")[1]);
    index = pokemonList.findIndex(pokemon => pokemon.name == this.innerHTML);
});

const resetList = () => {
    
    $("#editor").animate({
    opacity: 0,
    deg: 1080
  }, {
    duration: 1000,
    step: function(rotation) {
      $(this).css({
        transform: 'rotate(' + rotation + 'deg)'
      });
    }
  });
    $('ul').empty();
    pokemonList.forEach(pokemon => {
        $('ul').append(`<li id="${pokemon.type1}/${pokemon.type2}">` + pokemon.name + '</li>');
    });
    
    index = -1;
}

const addPokemon = () => {
    $('li.selected').removeClass('selected');
    $("#editor").css("display", "inline-block");
    $("#editor").animate({opacity: 1}, 750);
    $("#nameToEdit").val("New Pokemon");
    $("#type1").val("Normal");
    $("#type2").val("None");
    index = -1;
}

const savePokemon = () => {
    let pokemonData = {name: $("#nameToEdit").val(), type1: $("#type1").val(), type2: $("#type2").val()}
    if (index == -1) {
        pokemonList.push(pokemonData);
    } else {
        pokemonList[index] = pokemonData
    }
    $("#editor").css("opacity", "0");
    resetList();
}

const deletePokemon = () => {
    if (index == -1) {
        $("#editor").css("display", "none");
    } else {
        pokemonList.splice(index, 1);
        resetList();
    }
}

const cancelEditor = () => {
    $("#editor").css("display", "none");
    $("#editor").css("opacity", "0");
    index = -1;
}