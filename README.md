# Trabalho de Consumo de API's - Utilizando PokéAPI

A ideia do projeto é utilizar as requisições de API em JSON do [**PokéAPI**](https://pokeapi.co/), para construir uma espécie de um jogo, onde a função do jogador é cuidar de necessidades básicas dos seus Pokémons. Então, o usuário tem como função, alimentar cada um dos seus Pokémons e capturar novos quando possibilitado. Para conhecer mais da API, acesse a [**página do Github do PokéAPI**](https://github.com/PokeAPI/pokeapi#contributing).

O projeto consome URL's específicas para coletar dados de Ovos de Pokémon, para o chocamento de novos Pokémons, criando uma função extra para a aplicação. [**Documentação sobre os ovos**](https://pokeapi.co/docs/v2.html#egg-groups)

## Consumo dos dados sobre os ovos da API
```javascript
// Requisita os ovos da API, depois vai construindo a váriavel global
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
```

Além dos ovos, o projeto consume dados sobre os Pokémons, para assim, mostrar de forma visual os Pokémons consumidos. Assim, constroi o núcleo do cuidado de cada um dos Pokémons. [**Documentação sobre os Pokémons**](https://pokeapi.co/docs/v2.html#pokemon)

## Consumo dos dados sobre os Pokémons da API
```javascript
// Faz a requisição de cada um dos Pokémons (por url), então, vai construindo a váriavel global, recebe o id do Pokémon (baseado no parâmetro da url da API)
function loadPokemon(pokemon_id) {
    $.getJSON('https://pokeapi.co/api/v2/pokemon-species/' + pokemon_id).then(function(data) {
        pokemons.pokemons.push({id: data.id, name: data.name, url: 'https://pokeapi.co/api/v2/pokemon-species/' + pokemon_id, evolution_chain: data.evolution_chain.url});
    });
}
```

---

### Para rodar o projeto

> Primeiro de tudo, se caso utilizar Node.js, instale a dependência Express no seu gerenciador de pacotes favorito, para assim rodar o protocolo para a parte do servidor.
```shell
$ npm install express
$ yarn install express
```

> Agora, é possível rodar o projeto com o script definido no package.json:
```shell
$ npm start
$ yarn start
```

> Agora é só acessar o endereço localhost:3000

> Agora basta digitar no console do seu navegador de preferência, passando um nome de usuário qualquer (como um cadastro):
```javascript
createCookieUser('username');
```
