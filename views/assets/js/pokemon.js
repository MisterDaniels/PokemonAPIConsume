var eggs;

loadEggs();

function loadEggs() {
    $.getJSON('https://pokeapi.co/api/v2/egg-group/').then(function(data){
        eggs = data;
    });
}

function getRandomEgg(canRare = false) {
    var randomEgg;
    if (canRare === false) {
        randomEgg = Math.floor(Math.random()*eggs.count-1);
    } else {
        randomEgg = Math.floor(Math.random()*eggs.count);
    }

    return eggs.results[randomEgg];
}