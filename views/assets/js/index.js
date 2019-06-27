var socket = io();

var urlParam = getUrlParams();
var savedData;
var selectedPokemon;

if (urlParam['username'] != null) {  
  savedData = getCookie();

  if (savedData.username === urlParam['username']) {

    setTimeout(function (){
      document.getElementsByTagName('BODY')[0].style.display = '';

      document.getElementById('hint-title').innerHTML = "Olá treinador, " + savedData.username + "!"; 

      loadPlayerPokemon(0);
      loadPokemonsGenerated();
      selectedPokemon = 0;
    }, 4000);

    checkGeneration();
  }
}

function getUrlParams() {
  var params = {};
  var urlData = window.location.href.split('?');
  var pair = urlData[1].split('=');
  params[pair[0]] = pair[1];

  return params;
}

function createCookieUser(username) {
  var date = new Date();
  date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60));
  var expiration = "expires=" + date.toUTCString();

  // Valores iniciais
  var params = {   
    pokemons: [],
    generated_pokemons: []
  };

  params.username = username;
  var futureDate = new Date();
  params.generate_time = futureDate.setHours(futureDate.getHours() + 2);

  document.cookie = "data=" + JSON.stringify(params) + "; expires=" + expiration + "; path=/";
  savedData = getCookie();

  givePlayerEgg(getRandomEgg());
}

function getCookie() {
  var match = document.cookie.match(new RegExp('(^| )data=([^;]+)'));

  if (match) return JSON.parse(match[2]);
}

function saveCookie() {
  document.cookie = "data=" + JSON.stringify(savedData);
  
}

// TODO remove from here
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});

$('#pokemon-right').click(function() {
  if (selectedPokemon+1 == savedData.pokemons.length) {
    selectedPokemon = 0;
  } else {
    selectedPokemon++;
  }

  loadPlayerPokemon(selectedPokemon);
});

$('#pokemon-left').click(function() {
  if (selectedPokemon-1 == -1) {
    selectedPokemon = savedData.pokemons.length-1;
  } else {
    selectedPokemon--;
  }

  loadPlayerPokemon(selectedPokemon);
});

$('#action').click(function() {
  if ($('#action').text() == 'Chocar ovo') {
    changePlayerPokemon(selectedPokemon, hatchEgg(savedData.pokemons[selectedPokemon]));  
  } else if ($('#action').text() == 'Dar comida') {
    console.log('Dando comida');
    giveFood(selectedPokemon, 10);
    giveLevel(selectedPokemon, 1);
    loadPlayerPokemon(selectedPokemon);
  }
  
  saveCookie();
});

$('#generate').click(function() {
  generateRandomPokemons(5);

  saveCookie();
});