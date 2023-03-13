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
  const pokemonList = document.getElementById("pokemonList").innerHTML.split(',')
  if (pokemonList.length){
    document.getElementById("pokemonNumber").value = 1
    document.getElementById("pokemonList").innerHTML = ''
    const root = new Link(pokemonList[0])
    for (let i=1; i<pokemonList.length; i++){
      root.add(new Link(pokemonList[i]))
    }
    root.handle()
  }
}

function Link(id){
  this.id = id
  this.next = null
  
  this.add = function(link){
    if (this.next) this.next.add(link)
    if (!this.next) this.next = link
  }

  this.handle = async function(prev){
    console.log(`prev was ${prev}, curr is ${this.id}`)
    const response = await fetchPokemon(this.id)
    if (response.data && this.next) this.next.handle(this.id)
  }
}