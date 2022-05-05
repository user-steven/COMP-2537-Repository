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

async function getPokemon(url) {
    let res = await fetch(url)
    let pokemon = await res.json()
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
    $('#pokemon_gallery').empty()
    getPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
}

async function searchByType(type) {
    let res = await fetch("https://pokeapi.co/api/v2/type")
    let typeResult = await res.json()
    let typeUrl = null
    // return (typeResult.results[0].name)

    
    for (i=0; i < typeResult.count; i++) {
        if (type == typeResult.results[0].name)
            typeUrl = typeResult.results[0].url
    }

    if (typeUrl == null)
        return alert(`No type ${type} found. Try again.`)
    
    $('#pokemon_gallery').empty()
    let resFinal = await fetch(typeUrl)
    let typeFinal = await resFinal.json()

    for (i=0; i < typeFinal.pokemon.length; i++) {
        getPokemon(typeFinal.pokemon[i].pokemon.url)
    }
}

function searchGender(gender) {

}

function result() {
    let searchType = document.querySelector("#searchType").value
    let input = document.querySelector("#searchBox").value

    if (!isNaN(input))
        return alert("Please enter a valid search term. (letters only)")
    else {
        input = input.trim().toLowerCase()
    }

    if (searchType == "pokemon") {
        return searchPokemon(input)
    }

    if (searchType == "type") {
        return searchByType(input)
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
