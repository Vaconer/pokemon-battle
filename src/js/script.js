document.addEventListener("DOMContentLoaded", function () {
  // Obtém a lista de Pokémon e a barra de pesquisa
  const pokemonList = document.getElementById("pokemon-list");
  const searchBar = document.getElementById("search-bar");

  // Elementos dos cards de batalha (Pokémon 1 e Pokémon 2)
  const pokemon1Img = document.getElementById("pokemon1-img");
  const pokemon1Name = document.getElementById("pokemon1-name");
  const pokemon1Info = document.getElementById("pokemon1-info");
  const pokemon1HP = document.getElementById("pokemon1-hp");
  const pokemon1Attack = document.getElementById("pokemon1-attack");
  const pokemon1Damage = document.getElementById("pokemon1-damage");

  const pokemon2Img = document.getElementById("pokemon2-img");
  const pokemon2Name = document.getElementById("pokemon2-name");
  const pokemon2Info = document.getElementById("pokemon2-info");
  const pokemon2HP = document.getElementById("pokemon2-hp");
  const pokemon2Attack = document.getElementById("pokemon2-attack");
  const pokemon2Damage = document.getElementById("pokemon2-damage");

  const typeIcons = {
    fire: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/fire.svg" alt="Fire" style="width: 24px; height: 24px;" />`,
    water: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/water.svg" alt="Water" style="width: 24px; height: 24px;" />`,
    grass: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/grass.svg" alt="Grass" style="width: 24px; height: 24px;" />`,
    electric: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/electric.svg" alt="Electric" style="width: 24px; height: 24px;" />`,
    ice: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/ice.svg" alt="Ice" style="width: 24px; height: 24px;" />`,
    fighting: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/fighting.svg" alt="Fighting" style="width: 24px; height: 24px;" />`,
    poison: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/poison.svg" alt="Poison" style="width: 24px; height: 24px;" />`,
    ground: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/ground.svg" alt="Ground" style="width: 24px; height: 24px;" />`,
    flying: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/flying.svg" alt="Flying" style="width: 24px; height: 24px;" />`,
    psychic: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/psychic.svg" alt="Psychic" style="width: 24px; height: 24px;" />`,
    bug: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/bug.svg" alt="Bug" style="width: 24px; height: 24px;" />`,
    rock: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/rock.svg" alt="Rock" style="width: 24px; height: 24px;" />`,
    ghost: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/ghost.svg" alt="Ghost" style="width: 24px; height: 24px;" />`,
    dragon: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/dragon.svg" alt="Dragon" style="width: 24px; height: 24px;" />`,
    dark: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/dark.svg" alt="Dark" style="width: 24px; height: 24px;" />`,
    steel: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/steel.svg" alt="Steel" style="width: 24px; height: 24px;" />`,
    fairy: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/fairy.svg" alt="Fairy" style="width: 24px; height: 24px;" />`,
    normal: `<img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/normal.svg" alt="Normal" style="width: 24px; height: 24px;" />`,
  };
  // Variável para alternar entre o primeiro e o segundo Pokémon nos cards de batalha
  let selectedPokemon = 1;

  // Quantidade total de Pokémon que será buscada
  const pokemonCount = 898;

  // Armazena os dados de todos os Pokémon carregados
  let allPokemonData = [];

  // Função para buscar dados de um Pokémon da PokéAPI pelo ID
  async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar Pokémon com ID ${id}`);
    }
    return response.json();
  }


  // Função que cria e exibe um card para cada Pokémon na lista
  function createPokemonCard(pokemon) {
    const { name, types, sprites, stats, moves } = pokemon;

    // Cria o elemento HTML para o card
    const card = document.createElement("li");
    card.className = "card-pokemon";  // Classe CSS para estilizar os cards
    card.dataset.name = name.toLowerCase(); // Armazena o nome do Pokémon para busca
    card.dataset.sprite = sprites.front_default; // Sprite (imagem) do Pokémon
    card.dataset.types = types.map((type) => type.type.name).join(", "); // Armazena os tipos do Pokémon
    card.dataset.hp = stats.find((stat) => stat.stat.name === "hp").base_stat; // Pega o valor de HP do Pokémon
    card.dataset.attack = stats.find((stat) => stat.stat.name === "attack").base_stat; // Pega o valor de ataque do Pokémon
    card.dataset.damage = moves.length > 0 ? moves[0].move.name : "None"; // Nome do primeiro ataque

    // Define a cor do fundo do card baseado no tipo principal do Pokémon
    const backgroundColor = getTypeColor(types[0].type.name);
    card.style.backgroundColor = backgroundColor;
    card.style.border = `2px solid ${backgroundColor}`;
    card.style.boxShadow = `0 4px 10px rgba(${hexToRgb(backgroundColor)}, 0.5)`;

    // Estrutura HTML para exibir o sprite e as informações do Pokémon no card
    const infos = `
       <img src="${sprites.front_default}" alt="${name}" class="gif" />
    <div class="infos">
      <span>${name.charAt(0).toUpperCase() + name.slice(1)}</span>
      <ul class="types">
        ${types
          .map(
            (obj) =>
                `<li class="tipo ${obj.type.name}">${typeIcons[obj.type.name] || obj.type.name}</li>`
          )
          .join("")}
      </ul>
    </div>
`;
    
    // Define o conteúdo HTML do card
    card.innerHTML = infos;

    // Armazena o Pokémon completo no dataset do card
    card.dataset.pokemon = JSON.stringify(pokemon);

    // Adiciona evento de clique para selecionar o Pokémon para o card de batalha
    card.addEventListener("click", () => selectPokemon(card));

    // Adiciona o card do Pokémon à lista de cards no DOM
    pokemonList.appendChild(card);

    // Armazena o card para uso posterior (ex: filtragem)
    allPokemonData.push(card);
  }


  // Função que retorna a cor de fundo correspondente ao tipo de Pokémon
  function getTypeColor(type) {
    const colors = {
      fire: "#6D1D3F",     // tom mais escuro de vermelho com toque roxo
      water: "#3D4A6F",    // tom mais escuro de azul com toque roxo
      grass: "#4A5E3A",    // tom mais escuro de verde com toque roxo
      electric: "#6D5A3A", // tom mais escuro de amarelo com toque roxo
      ice: "#4B6A6A",     // tom mais escuro de verde-água com toque roxo
      fighting: "#5E2D2D", // tom mais escuro de vermelho com toque roxo
      poison: "#5A2C6A",  // tom mais escuro de roxo
      ground: "#6D4A2F",  // tom mais escuro de laranja com toque roxo
      flying: "#3D4A6F",  // tom mais escuro de azul com toque roxo (mesmo do water)
      psychic: "#6A3C5A", // tom mais escuro de rosa com toque roxo
      bug: "#4A6E3A",     // tom mais escuro de verde com toque roxo
      rock: "#6D5A4A",    // tom mais escuro de bege com toque roxo
      ghost: "#4A2D6A",   // tom mais escuro de roxo
      dragon: "#2F4A6D",  // tom mais escuro de azul com toque roxo
      dark: "#3E2D3E",    // tom mais escuro de cinza com toque roxo
      steel: "#3A5E6A",   // tom mais escuro de azul com toque roxo
      fairy: "#6A2F4F",   // tom mais escuro de rosa com toque roxo
      normal: "#6A6A6A",  // tom mais escuro de cinza com toque roxo
    };

    return colors[type] || "#A8A77A"; // Cor padrão se o tipo não for encontrado
  }

  // Função que converte hexadecimal em RGB
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  const isLoaded = ()=>{
    const load = document.getElementById('loading')
    load.style.display = 'none'
  }
  
  // Função que carrega os dados de todos os Pokémon e cria os cards
  async function loadPokemonData() {
    try {
      // Cria um array de promessas para buscar os dados de todos os Pokémon
      const promises = Array.from({ length: pokemonCount }, (_, index) => fetchPokemonData(index + 1));
  
      // Espera todas as promessas serem resolvidas
      const results = await Promise.all(promises);

      // Cria os cards dos  Pokémon
      results.forEach(data => createPokemonCard(data));
      isLoaded()
    } catch (error) {
      console.error("Erro ao carregar dados dos Pokémon:", error); // Mostra o erro no console, caso ocorra
    }
  }

  // Função para selecionar um Pokémon e exibir suas informações no card de batalha
  function selectPokemon(card) {
    const pokemon = JSON.parse(card.dataset.pokemon); // Obtém os dados completos do Pokémon do dataset
    const { name, types, sprites, stats, moves } = pokemon;
    const hp = stats.find((stat) => stat.stat.name === "hp").base_stat; // Obtém o HP do Pokémon
    const attack = stats.find((stat) => stat.stat.name === "attack").base_stat; // Obtém o ataque base do Pokémon
    const damage = moves.length > 0 ? moves[0].move.name : "None"; // Nome do primeiro movimento (ataque)

    const typesText = types.map((t) => typeIcons[t.type.name] || t.type.name).join(" "); // Concatena os tipos em uma string com ícones

    // Se for o primeiro Pokémon selecionado
    if (selectedPokemon === 1) {
      pokemon1Img.src = sprites.front_default;
      pokemon1Name.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      pokemon1Info.textContent = types.map((t) => t.type.name).join(", ");
      pokemon1HP.textContent = hp;
      pokemon1Attack.textContent = attack;
      pokemon1Damage.textContent = damage;
      selectedPokemon = 2; // Alterna para o próximo Pokémon
    } else {
      // Se for o segundo Pokémon selecionado
      pokemon2Img.src = sprites.front_default;
      pokemon2Name.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      pokemon2Info.textContent = types.map((t) => t.type.name).join(", ");
      pokemon2HP.textContent = hp;
      pokemon2Attack.textContent = attack;
      pokemon2Damage.textContent = damage;
      selectedPokemon = 1; // Alterna de volta para o primeiro Pokémon
    }
  }
  
  document.querySelectorAll('.itens img').forEach(icon => {
    icon.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      document.querySelectorAll('.card-pokemon').forEach(pokemon => { 
        const pokemonTypes = pokemon.getAttribute('data-types').split(', ');
        if (pokemonTypes.includes(type) || type === 'all') {
          pokemon.style.display = 'inline-block';
        } else {
          pokemon.style.display = 'none';
        }
      });
    });
  });

  // Corrija o filtro por nome
  function filterPokemonCards(query) {
    query = query.toLowerCase(); // Converte a consulta para minúsculas
    allPokemonData.forEach((card) => {
      const name = card.dataset.name.toLowerCase(); // Certifique-se de que o nome está em minúsculas
      if (name.includes(query)) {
        card.style.display = ""; // Exibe o card se o nome contiver a consulta
      } else {
        card.style.display = "none"; // Oculta o card se não contiver a consulta
      }
    });
  }

  // Adiciona um ouvinte de evento para a barra de pesquisa
  searchBar.addEventListener("input", (event) => {
    filterPokemonCards(event.target.value); // Filtra os cards conforme a entrada do usuário
  });

  // Código para carregar Pokémon
  loadPokemonData();
});

