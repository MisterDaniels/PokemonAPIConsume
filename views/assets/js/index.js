 
// Parâmetros da URL
var urlParam = getUrlParams();
// Dados do Cookie
var savedData;
// Indexador do Pokémon selecionado
var selectedPokemon;

// Verifica se o parâmetro 'username' está presente na URL, então, carrega os Cookies do usuário do parâmetro (se houver)
if (urlParam['username'] != null) {  
    savedData = getCookie();

    // Se for igual ao usuário cadastrado
    if (savedData.username === urlParam['username']) {

        // Espera 4 segundos antes de mostrar os contents e carregar os dados do Pokémon, para esperar as requisições assíncronas
        setTimeout(function (){
            document.getElementsByTagName('BODY')[0].style.display = '';

            document.getElementById('hint-title').innerHTML = "Olá treinador, " + savedData.username + "!"; 

            loadPlayerPokemon(0);
            loadPokemonsGenerated();
            selectedPokemon = 0;
        }, 4000);

        // Checa se o usuário saiu do site deixando Pokémons no mapa, então coloca
        checkGeneration();
    }
}

// Retorna o parâmetro da URL
function getUrlParams() {
  var params = {};
  var urlData = window.location.href.split('?');
  var pair = urlData[1].split('=');
  params[pair[0]] = pair[1];

  return params;
}

// Cria um usuário novo com os valores iniciais no cookie
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

  // Trata os dados, então salva no cookie em forma JSON/String
  document.cookie = "data=" + JSON.stringify(params) + "; expires=" + expiration + "; path=/";
  savedData = getCookie();

  // Da para o jogador um ovo aleatório
  givePlayerEgg(getRandomEgg());
}

// Coleta os cookies do site em específico
function getCookie() {
  var match = document.cookie.match(new RegExp('(^| )data=([^;]+)'));

  if (match) return JSON.parse(match[2]);
}

// Salva os dados locais no cookie
function saveCookie() {
  document.cookie = "data=" + JSON.stringify(savedData);
  
}

// Configurar tooltip para os ovos de Pokémon do Bootstrap
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
});

// Seta listener para a seta de troca de Pokémon da direita
$('#pokemon-right').click(function() {
  if (selectedPokemon+1 == savedData.pokemons.length) {
    selectedPokemon = 0;
  } else {
    selectedPokemon++;
  }

  loadPlayerPokemon(selectedPokemon);
});

// Seta listener para a seta de troca de Pokémon da esquerda
$('#pokemon-left').click(function() {
  if (selectedPokemon-1 == -1) {
    selectedPokemon = savedData.pokemons.length-1;
  } else {
    selectedPokemon--;
  }

  loadPlayerPokemon(selectedPokemon);
});

// Handler para as funções do botão de ação dos Pokémons
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

// Botão de gerar novos Pokémons no mapa
$('#generate').click(function() {
  generateRandomPokemons(5);

  saveCookie();
});