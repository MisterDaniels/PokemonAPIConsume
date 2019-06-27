
var eggs = {
    count: '',
    eggs: []
};
var pokemons = {
    count: 807,
    pokemons: [{
        evolutions: []
    }]
};
var evolutions = {
    evolutions: []
};
var data2;

var intervalToHatchAndFood;

loadEggs();
loadPokemons();

function loadEggs() {
    $.getJSON('https://pokeapi.co/api/v2/egg-group/').then(function(data){
        
        eggs.count = data.count;
        
        for(var i = 0; i < data.count; i++) {
            eggs.eggs.push({id: i, name: data.results[i].name, url: data.results[i].url, pokemon_possibilities: []});    
        }

        for (var i = 0; i < eggs.count; i++) {
            loadEggPossibilites(i);
        }

    });
}

function loadEggPossibilites(egg_id) {
    $.getJSON(eggs.eggs[egg_id].url).then(function(data) {
        for (var j = 0; j < data.pokemon_species.length; j++) {
            eggs.eggs[egg_id].pokemon_possibilities.push({name: data.pokemon_species[j].name, url: data.pokemon_species[j].url});
        }
    });
}

function loadPlayerPokemonDetails(evolve_url) {
    $.getJSON(evolve_url).then(function(data) {

    });
}

function loadPokemons() {
    $.getJSON('https://pokeapi.co/api/v2/pokemon/').then(function(data) {

        for (var i = 1; i <= pokemons.count; i++) {
            loadPokemon(i);
        }
    });
}

function loadPokemon(pokemon_id) {
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + pokemon_id).then(function(data) {
        pokemons.pokemons.push({id: data.id, name: data.name, url: 'https://pokeapi.co/api/v2/pokemon-species/' + pokemon_id, evolution_chain: data.evolution_chain.url});
    });
}

function loadEvolutions() {
    for (var i = 1; i <= pokemons.count; i++) {
        loadEvolution(i);
    }
}

function loadEvolution(pokemon_id) {
    $.getJSON(pokemons.pokemons[pokemon_id].evolution_chain).then(function(data) {
        pokemons.pokemons[pokemon_id].evolutions = {evolve_to: [{evolve_level: data.chain.evolves_to[0].evolution_details[0].min_level, evolve_name: data.chain.evolves_to[0].species.name}]};
        if (data.chain.evolves_to[0].evolves_to[0] != null) {
            pokemons.pokemons[pokemon_id].evolutions.evolve_to.push({evolve_level: data.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level, evolve_name: data.chain.evolves_to[0].evolves_to[0].species.name});
        }
    });
}

function getRandomPokemon() {
    var randomPokemon;

    randomPokemon = Math.floor(Math.random()*pokemons.count);

    return pokemons.pokemons[randomPokemon];
}

function getRandomEgg(canRare = false) {
    var randomEgg;
    if (canRare === false) {
        randomEgg = Math.floor(Math.random()*eggs.count-2);
    } else {
        randomEgg = Math.floor(Math.random()*eggs.count-1);
    }

    return eggs.eggs[randomEgg];
}

function loadPlayerPokemon(inventory_id) {
    if (savedData.pokemons[inventory_id].type === 'egg') {
        $('#pokemon-name h1:first').text(uppercaseFirst(savedData.pokemons[inventory_id].name) + " Egg");
        $('#pokemon-level p:first').text("");

        $('#pokemon-image img:first').attr('src', '/assets/img/' + savedData.pokemons[inventory_id].name + '.png');

        $('#action').attr('disabled', '');

        var timeToWait = new Date(savedData.pokemons[inventory_id].hatch) - new Date();
        if (timeToWait <= 0) {
            $('#action').text("Chocar ovo");
            $('#action').removeAttr('disabled');
        }

        clearInterval(intervalToHatchAndFood);
        intervalToHatchAndFood = setInterval(function() {
            timeToWait =  new Date(savedData.pokemons[inventory_id].hatch) - new Date();
            $('#action').text("Tempo para chocar: " + Math.floor((timeToWait/1000/60) << 0) + ":" + Math.floor((timeToWait/1000) % 60));

            if (timeToWait <= 0) {
                $('#action').text("Chocar ovo");
                $('#action').removeAttr('disabled');

                clearInterval(intervalToHatchAndFood);
            }
        }, 1000);

        var pokemonChancesHtml = "<p>Pokémons possíveis: </p><div class='row'>";
        for (var i = 0; i < eggs.eggs[savedData.pokemons[inventory_id].id].pokemon_possibilities.length; i++) {
            pokemonChancesHtml += "<img src='https://img.pokemondb.net/sprites/sun-moon/icon/" + eggs.eggs[savedData.pokemons[inventory_id].id].pokemon_possibilities[i].name + ".png'>"
        }
        pokemonChancesHtml += "</div>"

        $('#pokemon-chances').attr('data-original-title', pokemonChancesHtml);

    } else if (savedData.pokemons[inventory_id].type === 'pokemon') {
        $('#pokemon-name h1:first').text(uppercaseFirst(savedData.pokemons[inventory_id].name));
        $('#pokemon-level p:first').text("Level " + savedData.pokemons[inventory_id].level);

        $('#pokemon-image img:first').attr('src', 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/' + checkPokemonId(savedData.pokemons[inventory_id].id) + '.png');
        $('#pokemon-chances').attr('data-original-title', '');

        $('#action').removeAttr('disabled');
        $('#action').text("Dar comida");

        clearInterval(intervalToHatchAndFood);
        intervalToHatchAndFood = setInterval(function() {
            if (savedData.pokemons[inventory_id].life == 0) {
                killPokemon(inventory_id);

                clearInterval(intervalToHatchAndFood);

                loadPlayerPokemon(inventory_id);
            }

            if (savedData.pokemons[inventory_id].hunger == 0) {
                savedData.pokemons[inventory_id].life = savedData.pokemons[inventory_id].life - 1;
                $('#pokemon-life').text(savedData.pokemons[inventory_id].life + "%");
                $('#pokemon-life').attr('aria-valuenow', savedData.pokemons[inventory_id].life);
                $('#pokemon-life').css('width', savedData.pokemons[inventory_id].life + "%");
            }

            if (savedData.pokemons[inventory_id].hunger != 0) {
                savedData.pokemons[inventory_id].hunger = savedData.pokemons[inventory_id].hunger - 1;
                $('#pokemon-hunger').attr('aria-valuenow', savedData.pokemons[inventory_id].hunger);
                $('#pokemon-hunger').css('width', savedData.pokemons[inventory_id].hunger + "%");
                $('#pokemon-hunger').text(savedData.pokemons[inventory_id].hunger + "%");
            }

            saveCookie();
        }, 60000);

    } else {
        clearInterval(intervalToHatchAndFood);
        $('#pokemon-name h1:first').text(uppercaseFirst(savedData.pokemons[inventory_id].name) + " morto");
        $('#pokemon-level p:first').text("Morto no dia " + savedData.pokemons[inventory_id].dead_time);
        $('#pokemon-image img:first').attr('src', '/assets/img/dead.png');
        $('#pokemon-chances').attr('data-original-title', '');

        $('#action').attr('disabled', '');
        $('#action').text('Dar comida');
    }

    $('#pokemon-life').attr('aria-valuenow', savedData.pokemons[inventory_id].life);
    $('#pokemon-life').css('width', savedData.pokemons[inventory_id].life + "%");
    $('#pokemon-life').text(savedData.pokemons[inventory_id].life + "%");

    $('#pokemon-hunger').attr('aria-valuenow', savedData.pokemons[inventory_id].hunger);
    $('#pokemon-hunger').css('width', savedData.pokemons[inventory_id].hunger + "%");
    $('#pokemon-hunger').text(savedData.pokemons[inventory_id].hunger + "%");
}

function givePlayerPokemon(pokemon_name) {
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + pokemon_name).then(function(data) {

        var evolve_to;
        var level_to;
        $.getJSON(data.evolution_chain.url).then(function(data) {
            evolve_to = data.chain.evolves_to.evolves_to.species.name;
            level_to = data.chain.evolves_to.evolution_details.min_level;
        });

        setTimeout(function (){
            savedData.pokemons.push({'type': 'pokemon', 'id': data.id, 'name': pokemon_name, 'evolve_to': evolve_to, 'level_to': level_to, 'life': 100, 'hunger': 100, 'level': 1});
        }, 1000);

    });
}

function givePlayerEgg(egg, hoursToHatch = 1) {
    var futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + hoursToHatch);
    savedData.pokemons.push({'type': 'egg', 'id': egg.id, 'name': egg.name, 'url': egg.url, 'hatch': futureDate, 'life': 100, 'hunger': 100, 'level': 0});
}

function checkPokemonId(pokemon_id) {
    var id = parseInt(pokemon_id);
    if (id < 10) {
        id = "00" + id;
    } else if (id < 100) {
        id = "0" + id;
    }

    return id;
}

function changePlayerPokemon(inventory_id, pokemon_name) {
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + pokemon_name).then(function(data) {

        savedData.pokemons[inventory_id] = ({'type': 'pokemon', 'id': data.id, 'name': pokemon_name, 'evolve_url': data.evolution_chain.url, 'life': 100, 'hunger': 100, 'level': 1});
        loadPlayerPokemon(inventory_id);

    });
}

function hatchEgg(egg) {
    var randomPokemon;

    randomPokemon = Math.floor(Math.random()*eggs.eggs[egg.id].pokemon_possibilities.length);

    return eggs.eggs[egg.id].pokemon_possibilities[randomPokemon].name;
}

function capturePokemon() {

    return (Math.floor(Math.random()*100) >= 50) ? "Peguei!" : "Ele escapou!";

}  

function giveFood(inventory_id, quantity) {
    if (savedData.pokemons[inventory_id].hunger + quantity < 100) {
        savedData.pokemons[inventory_id].hunger = savedData.pokemons[inventory_id].food + quantity;
    } else {
        savedData.pokemons[inventory_id].hunger = 100;
    }
}

function giveLevel(inventory_id, quantity) {
    savedData.pokemons[inventory_id].level += quantity;
}

function killPokemon(inventory_id) {
    var date = new Date();
    savedData.pokemons[inventory_id].dead_time = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    savedData.pokemons[inventory_id].type = 'dead';
}

function uppercaseFirst(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}