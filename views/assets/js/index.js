var socket = io();

var urlParam = getUrlParams();

if (urlParam['username'] != null) {
  console.log("Usuário " + urlParam['username'] + " logado!");
  
  document.getElementsByTagName('BODY')[0].style.display = '';
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
  var params = {};
  params.username = username;
  params.pokemons[0] = getRandomEgg().then(function(returnData){return returnData});
  var futureDate = new Date();
  futureDate.setMinutes(futureDate.getMinutes() + 30);
  params.pokemons[0].hatch = futureDate;
  params.pokemons[0].life = 100;
  params.pokemons[0].hunger = 100;

  document.cookie = "data=" + JSON.stringify(params) + "; expires=" + expiration + "; path=/";
}

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});