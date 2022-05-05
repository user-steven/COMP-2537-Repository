function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function generateRandomSet(number) {
    let set = new Set()
    while (set.size < number) {
        set.add(getRandomInteger(1, 899))
    }
    return set
}

function getRandomNinePokemon() {
    let randomPokemonId = generateRandomSet(9)
    randomPokemonId.forEach(id => {
        getPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`)
    })
}

const getPokemon = async url => {
    const res = await fetch(url)
    const pokemon = await res.json()
    // console.log(pokemon)
    createPokemonCard(pokemon)
}

function createPokemonCard(pokemon) {
    let pokemonGallery = document.getElementById('pokemon_gallery')
    pokemonCard =
    `<div class='pokemonCard'>
    <div class='imgContainer'><img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}"></div>

    <div class="cardContent">
    <p class="cardTitle text--medium">${pokemon.name.toUpperCase()}</p>
    </div>
    
    </div>`
    pokemonGallery.innerHTML += pokemonCard
}

function searchPokemon(pokemon) {

}

function searchType(type) {

}

function searchGender(gender) {

}

function result() {
    let searchType = document.querySelector("#searchType").value
    let input = document.querySelector("#searchBox").value

    if (!isNaN(input))
        return alert("Please enter letters only.")
    else {
        input = input.trim().toLowerCase()
    }

    if (searchType == "pokemon") {
        return searchPokemon(input)
    }

    if (searchType == "type") {
        return searchType(input)
    }

    if (searchType == "gender") {
        return searchGender(input)
    }

    // console.log(input)
    // console.log(searchType)
}

function setup() {
    getRandomNinePokemon()
    document.getElementById("searchBoxSubmit").addEventListener("click", result)
}

jQuery(document).ready(setup)
