function addPokemonToList(){
  const pokemonNumber = document.getElementById("pokemonNumber").value
  const pokemonList = document.getElementById("pokemonList").innerHTML.split(',').filter(e => e !== "")
  if (pokemonList.indexOf(pokemonNumber) < 0) {
    pokemonList.push(pokemonNumber)
    document.getElementById("pokemonList").innerHTML = pokemonList.join(',')
  }
}

function fetchPokemon(id){
  return new Promise(async (resolve) => {
    try{
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      if (response.status === 200) {
        const json = await response.json()
        resolve({data: json})
      }
      if (response.status !== 200) resolve({error: `error fetching pokemon ${id}`})
    }
    catch(error){
      resolve({error: `error fetching pokemon ${id}`})
    }
  })
}

function go(){
  const pokemonList = document.getElementById("pokemonList").innerHTML.split(',').filter(e => e !== "")
  if (pokemonList.length){
    document.getElementById("pokemonNumber").value = 1
    document.getElementById("pokemonList").innerHTML = ''
    document.getElementById("results").innerHTML = ''
    const root = new Link(pokemonList[0])
    for (let i=1; i<pokemonList.length; i++){
      root.add(new Link(pokemonList[i]))
    }
    document.getElementById('menu').classList.add("hidden")
    document.getElementById('loading').classList.remove("hidden")
    root.handle()
  }
}

function addPokemon(json){
  const { data } = json
  let template = document.createElement('template');
  let html = `
    <div class="card animate__animated animate__flipInX">
      <img src="${data.sprites.front_default}" class="card-img-top" alt="${data.forms[0].name}">
      <div class="card-body">
        <h5 class="card-title">${data.forms[0].name.toUpperCase()}</h5>
        <p class="card-text"><b>Height: </b>${data.height}</p>
        <p class="card-text"><b>Height: </b>${data.weight}</p>
      </div>
    </div>
  `
  html = html.trim();
  template.innerHTML = html;
  document.getElementById("results").appendChild(template.content.firstChild);
}

function addError(){
  let template = document.createElement('template');
  let html = `
    <div class="card animate__animated animate__flipInX">
      <img src="error.png" class="card-img-top error-icon" alt="error">
      <div class="card-body">
        <h5 class="card-title">ERROR</h5>
        <p class="card-text">There was an error fetching this pokemon, chain will be broken</p>
      </div>
    </div>
  `
  html = html.trim();
  template.innerHTML = html;
  document.getElementById("results").appendChild(template.content.firstChild);
  document.getElementById('menu').classList.remove("hidden")
  document.getElementById('loading').classList.add("hidden")
}

function Link(id){
  this.id = id
  this.next = null
  
  this.add = function(link){
    if (this.next) this.next.add(link)
    if (!this.next) this.next = link
  }

  this.handle = async function(prev){
    const response = await fetchPokemon(this.id)
    if (response.data) addPokemon(response)
    if (response.error) addError()
    if (response.data && this.next) this.next.handle(this.id)
    if (response.data && !this.next) { 
      document.getElementById('menu').classList.remove("hidden")
      document.getElementById('loading').classList.add("hidden")
    }
  }
}