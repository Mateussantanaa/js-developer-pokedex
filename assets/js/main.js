const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resetButton = document.getElementById('resetButton');
const pagination = document.querySelector('.pagination');

window.ALL_POKEMON = window.ALL_POKEMON || [];

const maxRecords = 151;
const limit = 12;
let offset = 0;

function convertPokemonToLi(pokemon) {
  // pokemon aqui é esperado no formato do seu model: { number, name, types, type, photo }
  const id = pokemon.number || pokemon.id || '--';
  const name = pokemon.name || 'desconhecido';
  const typesArr = Array.isArray(pokemon.types) ? pokemon.types : (pokemon.type ? [pokemon.type] : []);
  const photo = pokemon.photo || (pokemon.sprites && pokemon.sprites.front_default) || '';

  return `
    <li class="pokemon ${pokemon.type || ''}" data-id="${id}" data-name="${(name||'').toLowerCase()}" data-types='${JSON.stringify(typesArr)}' data-sprite="${photo}">
      <span class="number">#${id}</span>
      <span class="name">${name}</span>
      <div class="detail">
        <ol class="types">
          ${typesArr.map((t) => `<li class="type ${t}">${t}</li>`).join('')}
        </ol>
        ${ photo ? `<img src="${photo}" alt="${name}">` : '' }
      </div>
    </li>
  `;
}

// Carrega itens (usa pokeApi.getPokemons - seu código existente)
function loadPokemonItens(loadOffset, loadLimit) {
  pokeApi.getPokemons(loadOffset, loadLimit).then((pokemons = []) => {
    pokemons.forEach(p => {
      const normalized = {
        id: p.number ? String(p.number) : (p.id ? String(p.id) : ''),
        name: (p.name || '').toString(),
        types: Array.isArray(p.types) ? p.types.slice() : (p.type ? [p.type] : []),
        sprites: { front_default: p.photo || (p.sprites && p.sprites.front_default) || '' },
        raw: p
      };
      if (!window.ALL_POKEMON.some(ex => ex.id === normalized.id && normalized.id !== '')) {
        window.ALL_POKEMON.push(normalized);
      }
    });

    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;
  }).catch(err => {
    console.error('Erro ao carregar pokémons:', err);
  });
}

// inicializa carregamento
loadPokemonItens(offset, limit);

if (loadMoreButton) {
  loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);

      // remove o botão quando terminar
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItens(offset, limit);
    }
  });
}

function getLoadedPokemonsSimple() {
  if (Array.isArray(window.ALL_POKEMON) && window.ALL_POKEMON.length) {
    return window.ALL_POKEMON;
  }

  const lis = Array.from(document.querySelectorAll('#pokemonList li'));
  return lis.map(li => {
    const id = li.dataset.id || (li.querySelector('.number') ? li.querySelector('.number').textContent.replace('#','').trim() : '');
    const name = (li.dataset.name || (li.querySelector('.name') ? li.querySelector('.name').textContent.trim() : '')).toString();
    let types = [];
    if (li.dataset.types) {
      try { types = JSON.parse(li.dataset.types); } catch(e) { types = [li.dataset.types]; }
    } else {
      const typeEls = Array.from(li.querySelectorAll('.type')).map(t => t.textContent.trim());
      if (typeEls.length) types = typeEls;
    }
    const img = li.querySelector('img');
    const sprite = img ? img.src : (li.dataset.sprite || '');
    return {
      id: id ? String(id) : '',
      name: name || '',
      types,
      sprites: { front_default: sprite },
    };
  });
}

function filterLoadedSimple(arr, term) {
  const t = (term || '').toString().trim().toLowerCase();
  if (!t) return [];
  return arr.filter(p => {
    const name = (p.name || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const types = (p.types || []).map(x => (x||'').toLowerCase());
    const matchName = name && name.includes(t);
    const matchId = id && (id === t || id === String(parseInt(t) || ''));
    const matchType = types.some(tp => tp.includes(t));
    return matchName || matchId || matchType;
  });
}

function renderResultsSimple(results) {
  if (!results || !results.length) {
    pokemonList.innerHTML = `<p class="not-found-message">Nenhum Pokémon encontrado!</p>`;
    return;
  }

  const allHaveRaw = results.every(r => r.raw);
  if (allHaveRaw && typeof convertPokemonToLi === 'function') {
    pokemonList.innerHTML = results.map(r => convertPokemonToLi(r.raw)).join('');
    return;
  }

  pokemonList.innerHTML = results.map(r => {
    const id = r.id || '--';
    const name = r.name || 'desconhecido';
    const img = (r.sprites && r.sprites.front_default) ? `<img src="${r.sprites.front_default}" alt="${name}">` : '';
    const typesHtml = (r.types || []).map(t => `<li class="type">${t}</li>`).join('');
    return `
      <li class="pokemon ${name}" data-id="${id}" data-name="${(name||'').toLowerCase()}" data-types='${JSON.stringify(r.types||[])}'>
        <span class="number">#${id}</span>
        <span class="name">${name}</span>
        <div class="detail">
          <ol class="types">${typesHtml}</ol>
          ${img}
        </div>
      </li>
    `;
  }).join('');
}

if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const term = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
    if (!term) return;
    if (pagination) pagination.style.display = 'none';
    if (resetButton) resetButton.classList.add('visible');

    const loaded = getLoadedPokemonsSimple();
    const matches = filterLoadedSimple(loaded, term);
    renderResultsSimple(matches);
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    if (pagination) pagination.style.display = 'flex';
    if (searchInput) searchInput.value = '';
    if (resetButton) resetButton.classList.remove('visible');

    if (pokemonList) pokemonList.innerHTML = '';
    window.ALL_POKEMON = [];
    offset = 0;
    if (!loadMoreButton || !document.body.contains(loadMoreButton)) {
      window.location.reload();
      return;
    }
    loadPokemonItens(offset, limit);
  });
}