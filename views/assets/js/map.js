var markers = [];
var infoWindow;

var intervalToGenerate;

function generateRandomPokemons(quantity) {

    savedData.generated_pokemons = [];
    markers = [];

    for (var i = 0; i < quantity; i++) {
        savedData.generated_pokemons.push(getRandomPokemon());

        markers[i] = new google.maps.Marker({
            position: getRandomLocation(),
            icon: 'https://img.pokemondb.net/sprites/sun-moon/icon/' + savedData.generated_pokemons[i].name + '.png',
            animation: google.maps.Animation.DROP,
            map: map
        });

        (function(i) {
            markers[i].addListener('click', function(event) {
            
                var captureChance = capturePokemon();

                infoWindow = new google.maps.InfoWindow({
                    content: captureChance
                });
                infoWindow.open(map, markers[i]);

                if (captureChance === 'Peguei!') {
                    givePlayerPokemon(savedData.generated_pokemons[i].name);
                }

                setTimeout(function () {
                    markers[i].setMap(null);
                    markers[i] = null;
                }, 3000);
                
                savedData.generated_pokemons[i] = null;
            });

            markers[i].addListener('mouseout', function() {
                infoWindow.close();
            });
        })(i);
    }

    var futureDate = new Date();
    savedData.generate_time = futureDate.setHours(futureDate.getHours() + 2);
    disableGeneration();
}

function getRandomLocation() {

    var southWest = new google.maps.LatLng(40.744656, -74.005966);
    var northEast = new google.maps.LatLng(4.052234, -118.243685);
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();

    return new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random());

}

function disableGeneration() {
    $('#generate').attr('disabled', '');

    intervalToGenerate = setInterval(function() {
        timeToWait =  new Date(savedData.generate_time) - new Date();
        $('#generate').text("Tempo para gerar: " + Math.floor((timeToWait/1000/60) << 0) + ":" + Math.floor((timeToWait/1000) % 60));
      
        if (timeToWait <= 0) {
            $('#action').text("Gerar Pokémons");
            $('#action').removeAttr('disabled');
      
            clearInterval(intervalToGenerate);
        }
    }, 1000);
}

function checkGeneration() {
    var timeToWait = new Date(savedData.generate_time) - new Date();

    if (timeToWait <= 0) {
        $('#action').text("Gerar Pokémons");
        $('#action').removeAttr('disabled');
    } else {
        disableGeneration();
    }
}

function loadPokemonsGenerated() {
    markers = [];

    for (var i = 0; i < savedData.generated_pokemons.length; i++) {

        if (savedData.generated_pokemons[i] != null) {
            markers[i] = new google.maps.Marker({
                position: getRandomLocation(),
                icon: 'https://img.pokemondb.net/sprites/sun-moon/icon/' + savedData.generated_pokemons[i].name + '.png',
                animation: google.maps.Animation.DROP,
                map: map
            });

            (function(i) {
                markers[i].addListener('click', function(event) {
                
                    var captureChance = capturePokemon();

                    infoWindow = new google.maps.InfoWindow({
                        content: captureChance
                    });
                    infoWindow.open(map, markers[i]);

                    if (captureChance === 'Peguei!') {
                        givePlayerPokemon(savedData.generated_pokemons[i].name);
                    }

                    setTimeout(function () {
                        markers[i].setMap(null);
                        markers[i] = null;
                    }, 3000);
                    
                    savedData.generated_pokemons[i] = null;
                });

                markers[i].addListener('mouseout', function() {
                    infoWindow.close();
                });
            })(i);
        }
    }

    disableGeneration();
}