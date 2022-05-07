const colors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
}

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
    // console.log(Promise.reject(error))
    createPokemonCard(pokemon)
}

function clicked() {
    console.log("clicked")
}

function createPokemonCard(pokemon) {
    let pokemonGallery = document.getElementById('pokemonGallery')
    let backgroundColor = colors[pokemon.types[0].type.name]
    pokemonCard =
    `<button id="${pokemon.id}" class="pokemonCardButton" onclick="generatePokemonProfile(this.id)"><div class='pokemonCard' style="background-color: ${backgroundColor};">
    <div class='imgContainer'><img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}"></div>

    <div class="cardContent">
    <p class="cardTitle text--medium">${pokemon.name.toUpperCase()}</p>
    </div>
    
    </div></button>`
    pokemonGallery.innerHTML += pokemonCard
}

function searchByPokemon(pokemon) {
    $('#pokemonGallery').empty()
    getPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
}

async function searchByType(type) {
    let res = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    let typeResult = await res.json()

    $('#pokemonGallery').empty()

    for (i=0; i < typeResult.pokemon.length; i++) {
        getPokemon(typeResult.pokemon[i].pokemon.url)
    }

}

async function searchByAbility(ability) {
    let res = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
    let abilityResult = await res.json()

    $('#pokemonGallery').empty()

    for (i=0; i < abilityResult.pokemon.length; i++) {
        getPokemon(abilityResult.pokemon[i].pokemon.url)
    }
}

function result() {
    $("#historyContainer").show()
    let searchType = document.querySelector("#searchType").value
    let input = document.querySelector("#searchBox").value
    document.getElementById("history").innerHTML += `<span>${searchType} ${input}<button class="searchHistory"> search</button><button class="removeSearch"> remove</button><br></span>`
    if (!isNaN(input))
        return alert("Please enter a valid search term. (letters only)")
    else {
        input = input.trim().toLowerCase().replaceAll(' ', '-')
    }

    if (searchType == "pokemon") {
        return searchByPokemon(input)
    }

    if (searchType == "type") {
        return searchByType(input)
    }

    if (searchType == "ability") {
        return searchByAbility(input)
    }

    // console.log(input)
    // console.log(searchType)
}

// function checkPokemonGallery() {
//     let gallery = document.getElementById('pokemonGallery')
//     if (gallery.textContent.trim() === '')
//         gallery.innerHTML += "<h6>Nothing Found</h6>"
// }

function removeHistory() {
    $(this).parent().remove()
}

function searchHistory() {
    let searchTerms = $(this).parent().text().split(" ")
    // console.log(searchTerms)
    let searchType = searchTerms[0]
    let input = searchTerms[1].trim().toLowerCase().replaceAll(' ', '-')

    if (searchType == "pokemon") {
        return searchByPokemon(input)
    }

    if (searchType == "type") {
        return searchByType(input)
    }

    if (searchType == "ability") {
        return searchByAbility(input)
    }
}

async function generatePokemonProfile(id) {
    console.log(typeof(id))
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let pokemon = await res.json()
    console.log(pokemon)
}

function clearHistory() {
    $("#history").empty()
    $("#historyContainer").hide()
}

async function setup() {
    getRandomNinePokemon()
    document.getElementById("searchBoxSubmit").addEventListener("click", result)
    document.getElementById("clearHistory").addEventListener("click", clearHistory)
    $("#historyContainer").hide()
    $('#history').on("click", ".removeSearch", removeHistory)
    $('#history').on("click", ".searchHistory", searchHistory)
}

jQuery(document).ready(setup)
