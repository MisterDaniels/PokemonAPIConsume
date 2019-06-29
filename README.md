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
> Atualize a página com a url localhost:3000?username='username-cadastrado-anteriormente'

Pronto, agora com os dados inicias salvos no Cookie, é possível entrar na conta cadastrada passando o username na url como parâmetro

---

## Funcionalidades e imagens

### Alimentar
A aplicação tem como base alimentar o Pokémon do usuário. É utilizado um ciclo padrão de 1 em 1 minuto para dar fome para o Pokémon, representado na barra de progresso mais abaixo. Se caso essa base de 100% terminar, é começado um ciclo de 1 em 1 minuto para remover a vida do Pokémon. Caso o Pokémon perca o total de vida, ele morre.
![alt text](https://i.ibb.co/8cTk1wV/Morte.png)

### Level
Os Pokémons possuem level apenas para fundamento de evolução (não presente no estado projeto)
![alt text](https://i.ibb.co/B6M1Wqv/Level.png)

### Inventário de Pokémons
O jogador cadastrado, possue um inventário de Pokémons que pode ser expandido. Para trocar de Pokémon, é utilizado as setas para mostrar cada um individualmente.
![alt text](https://i.ibb.co/YdKFHkd/Comida.png)

### Ovos de Pokémon
É possível o jogador possuir ovos para geração de novos Pokémons. Cada ovo tem um determinado número de Pokémons que podem nascer deles, é possível ver essas informações no tooltip da imagem do ovo. Os ovos também possuem ciclo de chocamento, tendo que o jogador esperar um tempo real, antes de chocar o ovo específico.
![alt text](https://i.ibb.co/LDw0784/Ovo.png)
![alt text](https://i.ibb.co/W6SjGDV/Ovo-2.png)

### Mapa para Captura de novos Pokémons
O mapa é utilizado para capturar novos Pokémons, ele possue um tempo especifíco para gerar novos Pokémons no mapa, para assim, o jogador poder gerar novos Pokémons. Cada Pokémon do mapa é gerado de forma aleatória em um raio próximo aos EUA. Ao clicar em cada icone de Pokémon, é possível capturar ou não em uma chande de 50/50.
![alt text](https://i.ibb.co/9tvwXGt/Mapa.png)

![alt text](https://i.ibb.co/NFSqX4K/Screenshot.png)
![alt text](https://i.ibb.co/nmDV01B/Screenshot-2.png)
