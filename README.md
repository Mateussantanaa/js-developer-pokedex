# Trilha JS Developer - Pokedex
# 📘 Pokedex

Uma pequena aplicação front-end que exibe os **151 Pokémons da primeira geração**, com cards estilizados, busca local e paginação.  
O objetivo é oferecer uma experiência rápida, responsiva e organizada para visualizar informações básicas dos Pokémons.

---

## 🚀 Funcionalidades

- 📱 **Layout responsivo** — cards adaptáveis por tipo, com gradientes de cores.  
- 🔎 **Busca local** — filtra por nome, número ou tipo.  
- 📂 **Paginação** — botão *Ver mais* para carregar mais Pokémons.  
- ♻️ **Reset** — retorna ao estado inicial da lista.  
- ⚡ **Cache global opcional** — permite busca instantânea entre todos os 151 Pokémons.  

---

## 📂 Estrutura do Projeto

/project-root
│
├─ index.html
├─ assets/
│ ├─ css/
│ │ ├─ global.css
│ │ └─ pokedex.css
│ └─ js/
│ ├─ pokemon-model.js # classe Pokemon e conversores
│ ├─ poke-api.js # integração com a PokeAPI
│ └─ main.js # lógica de renderização e busca
└─ README.md


---

## ▶️ Como rodar

Abra o projeto em um **servidor local** (não use `file://`).

### Opção 1 — VSCode (Live Server)
1. Abra a pasta no VSCode.  
2. Instale a extensão *Live Server*.  
3. Clique em *Go Live* e acesse `http://localhost:5500`.

### Opção 2 — Python
```bash
# Python 3
python -m http.server 5500


Acesse em: http://localhost:5500

🔎 Como funciona a busca

Por padrão, busca apenas nos Pokémons já renderizados na tela.

Para buscar entre todos os 151, basta expor um cache global:

window.ALL_POKEMON = pokemonsArray.map(p => ({
  id: String(p.number),
  name: p.name,
  types: p.types,
  sprites: { front_default: p.photo },
  raw: p
}));


Assim a pesquisa é instantânea em toda a coleção.

🎨 Personalização

Alterar gradientes no CSS (pokedex.css) para mudar cores por tipo.

Atualizar convertPokemonToLi em main.js para incluir mais informações no card.

Adicionar animações com transition ou transform para interações mais fluidas.

🛠️ Problemas comuns

Imagens não carregam → verifique se pokemon.photo está definido no modelo.

Busca não encontra → certifique-se de que window.ALL_POKEMON foi populado corretamente.

Erro de CORS → abra via servidor local, não direto com file://.

📄 Licença

Projeto livre para estudos e customização.
Sprites e dados: PokeAPI