function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function generateRandomSet(number) {
    let set = new Set()
    while (set.size < number) {
        set.add(getRandomInteger(0, 712))
    }
    return set
}

function getRandomNinePokemon() {
    let randomPokemonId = generateRandomSet(9)
    randomPokemonId.forEach(id => {
        getPokemon(id)
    })
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokemon = await res.json()
    // console.log(pokemon)
    createPokemonCard(pokemon)
}

function createPokemonCard(pokemon) {
    let pokemonGallery = document.getElementById('pokemon_gallery')
    pokemonCard =
    `<div class='pokemonCard'>
    <div class='imgContainer'><img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"></div>
    <h6 class='cardTitle'>${pokemon.name.toUpperCase()}</h5>
    </div>`
    pokemonGallery.innerHTML += pokemonCard
}

getRandomNinePokemon()