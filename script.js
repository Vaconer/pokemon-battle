document.addEventListener("DOMContentLoaded", function () {
  // Obtém a lista de Pokémon e a barra de pesquisa
  const pokemonList = document.getElementById("pokemon-list");
  const searchBar = document.getElementById("search-bar");

  // Quantidade total de Pokémon que será buscada
  const pokemonCount = 898;

  // Card que será atribuido o pokemon selecionado
  let selectedPokemon = 1;

  // Armazena os dados de todos os Pokémon carregados
  let allPokemonData = [];

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

  // Função para buscar dados de um Pokémon da PokéAPI pelo ID
  async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar Pokémon com ID ${id}`);
    }
    return response.json();
  }

  // Função para popular o conteúdo do card, tanto para lista quanto para a batalha
  function populateCardContent(card, pokemon, isBack = false) {
    const { name, types, sprites, stats, moves } = pokemon;

    const img = document.createElement("img");
    img.src = sprites.front_default;
    img.alt = `${name} image`;
    img.classList.add("gif");

    const nameElement = document.createElement("p");
    nameElement.classList.add("title");
    nameElement.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    const typeElement = document.createElement("ul");
    typeElement.classList.add("types");
    types.forEach((type) => {
      const typeItem = document.createElement("li");
      typeItem.classList.add("type", type.type.name);
      typeItem.innerHTML = typeIcons[type.type.name] || type.type.name;
      typeElement.appendChild(typeItem);
    });

    card.innerHTML = "";

    if (!isBack) {
      card.appendChild(img);
      card.appendChild(nameElement);
      card.appendChild(typeElement);
      // Armazena os tipos dos Pokémon no atributo data-types
      card.dataset.types = types.map((type) => type.type.name).join(", ");
    } else {
      const statsTitle = document.createElement("p");
      statsTitle.classList.add("title");
      statsTitle.textContent = "Stats";

      const hpElement = document.createElement("p");
      hpElement.classList.add("stats");
      hpElement.innerHTML = `Vida: <span>${
        stats.find((stat) => stat.stat.name === "hp").base_stat
      }</span>`;

      const attackElement = document.createElement("p");
      attackElement.classList.add("stats");
      attackElement.innerHTML = `Ataque: <span>${
        stats.find((stat) => stat.stat.name === "attack").base_stat
      }</span>`;

      const damageElement = document.createElement("p");
      damageElement.classList.add("stats");
      const damage =
        moves.length > 0 ? moves[0].move.name.split("-").join(" ") : "None";
      damageElement.innerHTML = `Poder: <span>${damage}</span>`;
      card.appendChild(statsTitle);
      card.appendChild(hpElement);
      card.appendChild(attackElement);
      card.appendChild(damageElement);
    }
  }

  // Função que cria e exibe um card para cada Pokémon na lista
  function createPokemonCard(pokemon) {
    const card = document.createElement("li");
    card.className = "card-pokemon";
    card.dataset.pokemon = JSON.stringify(pokemon);

    const backgroundColor = getTypeColor(pokemon.types[0].type.name);
    card.style.backgroundColor = backgroundColor;
    card.style.border = `2px solid ${backgroundColor}`;
    card.style.boxShadow = `0 4px 10px rgba(${hexToRgb(backgroundColor)}, 0.5)`;

    // Popula o card usando a função genérica
    populateCardContent(card, pokemon);

    card.addEventListener("click", () => selectPokemon(card));

    pokemonList.appendChild(card);
    allPokemonData.push(card);
  }

  // Função para selecionar um Pokémon e exibir suas informações no card de batalha
  function selectPokemon(card) {
    if (inBattle()) return;
    const pokemon = JSON.parse(card.dataset.pokemon);
    const backgroundColor = getTypeColor(pokemon.types[0].type.name);

    function setupSelectedCard(cardFront, cardBack) {
      cardFront.style.backgroundColor = backgroundColor;
      cardFront.style.border = `2px solid ${backgroundColor}`;
      cardFront.style.boxShadow = `0 4px 10px rgba(${hexToRgb(
        backgroundColor
      )}, 0.5)`;

      cardBack.style.backgroundColor = backgroundColor;
      cardBack.style.border = `2px solid ${backgroundColor}`;
      cardBack.style.boxShadow = `0 4px 10px rgba(${hexToRgb(
        backgroundColor
      )}, 0.5)`;

      // Popula a frente e o verso usando a função genérica
      populateCardContent(cardFront, pokemon);
      populateCardContent(cardBack, pokemon, true);
    }

    if (selectedPokemon === 1) {
      const pokemon1Card = document.getElementById("pokemon1-card");
      const pokemon1Front = pokemon1Card.querySelector(".flip-card-front");
      const pokemon1Back = pokemon1Card.querySelector(".flip-card-back");

      pokemon1Front.classList.add("selected-card");
      pokemon1Back.classList.add("selected-card");

      setupSelectedCard(pokemon1Front, pokemon1Back);
      pokemon1Card.dataset.pokemon = JSON.stringify(pokemon);

      selectedPokemon = 2;
    } else {
      const pokemon2Card = document.getElementById("pokemon2-card");
      const pokemon2Front = pokemon2Card.querySelector(".flip-card-front");
      const pokemon2Back = pokemon2Card.querySelector(".flip-card-back");

      pokemon2Front.classList.add("selected-card");
      pokemon2Back.classList.add("selected-card");

      setupSelectedCard(pokemon2Front, pokemon2Back);
      pokemon2Card.dataset.pokemon = JSON.stringify(pokemon);

      selectedPokemon = 1;
    }
  }

  // Remove o loading
  const isLoaded = () => {
    const load = document.getElementById("loading");
    load.style.display = "none";
  };

  // Função que carrega os dados de todos os Pokémon e cria os cards
  async function loadPokemonData() {
    try {
      const promises = Array.from({ length: pokemonCount }, (_, index) =>
        fetchPokemonData(index + 1)
      );
      const results = await Promise.all(promises);
      results.forEach((data) => createPokemonCard(data));
      isLoaded();
      document.getElementById("btn-export").style.display = "flex";
    } catch (error) {
      console.error("Erro ao carregar dados dos Pokémon:", error);
    }
  }

  // Função que filtra os pokémons por tipo
  function filterByType(type) {
    document.querySelectorAll(".card-pokemon").forEach((pokemon) => {
      const typesAttr = pokemon.getAttribute("data-types");
      if (typesAttr) {
        const pokemonTypes = typesAttr.split(", ");
        const removeFilterIcon = document.getElementById("remove-filter");
        if (type) {
          removeFilterIcon.style.display = "inline-block";
        } else {
          removeFilterIcon.style.display = "none";
        }

        if (pokemonTypes.includes(type) || !type) {
          pokemon.style.display = "inline-block";
        } else {
          pokemon.style.display = "none";
        }
      }
    });
  }

  // Adiciona um ouvinte de evento para os filtros
  document.querySelectorAll(".items img").forEach((icon) => {
    icon.addEventListener("click", function () {
      const type = this.getAttribute("data-type");
      filterByType(type);
    });
  });

  // Adiciona um ouvinte de evento para a barra de pesquisa
  document.addEventListener("DOMContentLoaded", () => {
    const removeFilterIcon = document.getElementById("remove-filter");

    if (removeFilterIcon) {
      removeFilterIcon.addEventListener("click", () => {
        // Exibe todos os cards
        filterByType(null);
      });
    }
  });

  // Função que filtra os resultados da busca
  function searchPokemonCards(query) {
    query = query.toLowerCase();

    allPokemonData.forEach((card) => {
      const pokemonData = JSON.parse(card.dataset.pokemon);
      const name = pokemonData.name.toLowerCase();
      if (name.includes(query)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Função que verifica se a batalha está em andamento
  const inBattle = () => {
    const battleButton = document.getElementById("btn-battle");
    const innerText = battleButton.innerText;
    if (innerText === "INICIAR BATALHA") return false;
    return true;
  };

  // Adiciona um ouvinte de evento para a barra de pesquisa
  searchBar.addEventListener("input", (event) => {
    searchPokemonCards(event.target.value);
  });

  loadPokemonData();
});

/*  FUNÇOES DE BATALHA */

// Função que inicia a batalha
function startBattle() {
  const pokemon1Data = JSON.parse(
    document.getElementById("pokemon1-card").dataset.pokemon
  );
  const pokemon2Data = JSON.parse(
    document.getElementById("pokemon2-card").dataset.pokemon
  );

  // Extrair os atributos de cada Pokémon (vida e ataque)
  const pokemon1HP = pokemon1Data.stats.find(
    (stat) => stat.stat.name === "hp"
  ).base_stat;
  const pokemon1Attack = pokemon1Data.stats.find(
    (stat) => stat.stat.name === "attack"
  ).base_stat;

  const pokemon2HP = pokemon2Data.stats.find(
    (stat) => stat.stat.name === "hp"
  ).base_stat;
  const pokemon2Attack = pokemon2Data.stats.find(
    (stat) => stat.stat.name === "attack"
  ).base_stat;

  // Lógica simples de batalha: Pokémon com maior ataque vence. Em caso de empate, o de maior HP vence
  let winner;
  if (pokemon1Attack > pokemon2Attack) {
    winner = 1;
  } else if (pokemon2Attack > pokemon1Attack) {
    winner = 2;
  } else {
    // Empate no ataque, comparar pelo HP
    if (pokemon1HP > pokemon2HP) {
      winner = 1;
    } else if (pokemon2HP > pokemon1HP) {
      winner = 2;
    } else {
      // Empate completo (ataque e HP iguais), escolha aleatória
      winner = Math.random() > 0.5 ? 1 : 2;
    }
  }

  // Exibir o botão de download
  document.getElementById("download-report").style.display = "block";
  document.getElementById("download-report").onclick = function () {
    generateBattleReport(pokemon1Data, pokemon2Data, winner);
  };
  handleSwapButton("reset");
  animationBattleCards(winner);
}

// Função que anima a batalha
const animationBattleCards = (winner) => {
  const card1 = document.getElementById("pokemon1-card");
  const card2 = document.getElementById("pokemon2-card");
  const wrapper = document.getElementById("wrapper-cards-battle");
  card1.style.animation = "moveCardToRight 1s forwards";
  card2.style.animation = "moveCardToLeft 1s forwards";
  card1.classList.add("disable-hover");
  card2.classList.add("disable-hover");

  wrapper.style.height = "450px";
  setTimeout(() => {
    wrapper.classList.add("show-winner");
  }, 700);
  if (winner === 1) {
    card1.style.zIndex = 9;
    card2.style.zIndex = 1;
  } else if (winner === 2) {
    card2.style.zIndex = 9;
    card1.style.zIndex = 1;
  }
};

// Função que reseta a batalha
const resetBattle = () => {
  const card1 = document.getElementById("pokemon1-card");
  const card2 = document.getElementById("pokemon2-card");
  const wrapper = document.getElementById("wrapper-cards-battle");

  // Remove o dataset e as classes dos cards
  const resetCard = (card) => {
    const cardFront = card.querySelector(".flip-card-front");
    const cardBack = card.querySelector(".flip-card-back");

    cardFront.classList.remove("selected-card");
    cardBack.classList.remove("selected-card");

    cardFront.style.backgroundColor = "";
    cardFront.style.border = "";
    cardFront.style.boxShadow = "";

    cardBack.style.backgroundColor = "";
    cardBack.style.border = "";
    cardBack.style.boxShadow = "";

    card.dataset.pokemon = "";
  };

  resetCard(card1);
  resetCard(card2);

  // Reseta o wrapper e os estilos dos cards
  wrapper.style.height = "300px";
  card1.style.animation = "";
  card2.style.animation = "";
  card1.classList.remove("disable-hover");
  card2.classList.remove("disable-hover");
  wrapper.classList.remove("show-winner");
  document.getElementById("download-report").style.display = "none";

  // Troca o texto e estilo do botão
  handleSwapButton("battle");
};

// Função que troca o texto e o estilo do botão, para "NOVA BATALHA" ou "INICIAR BATALHA"
function handleSwapButton(state) {
  const battleButton = document.getElementById("btn-battle");
  if (!battleButton) return;
  if (state === "reset") {
    battleButton.innerText = "NOVA BATALHA";
    battleButton.style.background =
      "linear-gradient(93deg, rgba(48,148,246,1) 32%, rgba(149,17,230,1) 96%)";
    battleButton.onclick = resetBattle;
    battleButton.onclick = resetBattle;
  } else if (state === "battle") {
    battleButton.innerText = "INICIAR BATALHA";
    battleButton.style.background =
      "linear-gradient(93deg, rgba(246, 120, 48, 1) 32%, rgba(230, 17, 17, 1) 96%)";
    battleButton.onclick = startBattle;
  }
}

/* FUNÇOES DE MANIPULAÇÃO DE ARQUIVOS */

// Função para gerar o relatório da batalha
function generateBattleReport(pokemon1Data, pokemon2Data, winner) {
  // Obter a data e hora atuais
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();

  // Gerar o conteúdo do relatório
  const reportContent = `
    Relatório da Batalha
    ====================
    Data: ${dateString}
    Hora: ${timeString}
    
    Pokémon 1:
    Nome: ${
      pokemon1Data.name.charAt(0).toUpperCase() + pokemon1Data.name.slice(1)
    }
    HP: ${pokemon1Data.stats.find((stat) => stat.stat.name === "hp").base_stat}
    Ataque: ${
      pokemon1Data.stats.find((stat) => stat.stat.name === "attack").base_stat
    }
    Tipos: ${pokemon1Data.types.map((type) => type.type.name).join(", ")}
    Movimentos: ${pokemon1Data.moves
      .slice(0, 3)
      .map((move) => move.move.name)
      .join(", ")} 

    Pokémon 2:
    Nome: ${
      pokemon2Data.name.charAt(0).toUpperCase() + pokemon2Data.name.slice(1)
    }
    HP: ${pokemon2Data.stats.find((stat) => stat.stat.name === "hp").base_stat}
    Ataque: ${
      pokemon2Data.stats.find((stat) => stat.stat.name === "attack").base_stat
    }
    Tipos: ${pokemon2Data.types.map((type) => type.type.name).join(", ")}
    Movimentos: ${pokemon2Data.moves
      .slice(0, 3)
      .map((move) => move.move.name)
      .join(", ")}  
    
    Resultado da Batalha:
    ----------------------
    Vencedor: Pokémon ${winner} (${
    winner === 1 ? pokemon1Data.name : pokemon2Data.name
  })
  `;

  // Criar um blob com o conteúdo do relatório
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Criar um link de download e clicar nele programaticamente
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_batalha_${dateString.replace(
    /\//g,
    "-"
  )}_${timeString.replace(/:/g, "-")}.txt`;
  document.body.appendChild(a);
  a.click();

  // Limpar o link e URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAllPokemonData() {
  // Coleta todos os dados dos cards visíveis
  const pokemonData = Array.from(
    document.querySelectorAll(".card-pokemon")
  ).map((card) => {
    const pokemon = JSON.parse(card.dataset.pokemon);
    return {
      name: pokemon.name,
      types: pokemon.types.map((typeInfo) => typeInfo.type.name),
      stats: pokemon.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
      })),
      moves: pokemon.moves.map((moveInfo) => moveInfo.move.name),
    };
  });

  // Cria um Blob com os dados em formato JSON
  const blob = new Blob([JSON.stringify(pokemonData, null, 2)], {
    type: "application/json",
  });

  // Cria um link para download
  const url = URL.createObjectURL(blob);
  console.log(blob);
  console.log(url);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pokemon_data.json";
  a.click();

  // Limpa o URL criado para liberar memória
  URL.revokeObjectURL(url);
}
/* FUNÇÕES AUXILIARES */

// Função que retorna a cor de fundo correspondente ao tipo de Pokémon
function getTypeColor(type) {
  const colors = {
    fire: "#6D1D3F", // tom mais escuro de vermelho com toque roxo
    water: "#3D4A6F", // tom mais escuro de azul com toque roxo
    grass: "#4A5E3A", // tom mais escuro de verde com toque roxo
    electric: "#6D5A3A", // tom mais escuro de amarelo com toque roxo
    ice: "#4B6A6A", // tom mais escuro de verde-água com toque roxo
    fighting: "#5E2D2D", // tom mais escuro de vermelho com toque roxo
    poison: "#5A2C6A", // tom mais escuro de roxo
    ground: "#6D4A2F", // tom mais escuro de laranja com toque roxo
    flying: "#3D4A6F", // tom mais escuro de azul com toque roxo (mesmo do water)
    psychic: "#6A3C5A", // tom mais escuro de rosa com toque roxo
    bug: "#4A6E3A", // tom mais escuro de verde com toque roxo
    rock: "#6D5A4A", // tom mais escuro de bege com toque roxo
    ghost: "#4A2D6A", // tom mais escuro de roxo
    dragon: "#2F4A6D", // tom mais escuro de azul com toque roxo
    dark: "#3E2D3E", // tom mais escuro de cinza com toque roxo
    steel: "#3A5E6A", // tom mais escuro de azul com toque roxo
    fairy: "#6A2F4F", // tom mais escuro de rosa com toque roxo
    normal: "#6A6A6A", // tom mais escuro de cinza com toque roxo
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
