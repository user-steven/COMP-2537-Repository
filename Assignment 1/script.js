var historyId = 0

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

function searchByPokemon(pokemon) {
    $('#pokemon_gallery').empty()
    getPokemon(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
}

async function searchByType(type) {
    let res = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    let typeResult = await res.json()

    $('#pokemon_gallery').empty()

    for (i=0; i < typeResult.pokemon.length; i++) {
        getPokemon(typeResult.pokemon[i].pokemon.url)
    }

}

async function searchByAbility(ability) {
    let res = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
    let abilityResult = await res.json()

    $('#pokemon_gallery').empty()

    for (i=0; i < abilityResult.pokemon.length; i++) {
        getPokemon(abilityResult.pokemon[i].pokemon.url)
    }
}

function result() {
    $("#clearHistory").show()
    let searchType = document.querySelector("#searchType").value
    let input = document.querySelector("#searchBox").value
    document.getElementById("history").innerHTML += `<span id="${historyId}">${searchType} ${input}<button class="searchHistory"> search</button><button class="removeSearch"> remove</button><br></span>`
    historyId++
    if (!isNaN(input))
        return alert("Please enter a valid search term. (letters only)")
    else {
        input = input.trim().toLowerCase()
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
//     let gallery = document.getElementById('pokemon_gallery')
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
    let input = searchTerms[1]

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

function clearHistory() {
    $("#history").empty()
}

function setup() {
    getRandomNinePokemon()
    document.getElementById("searchBoxSubmit").addEventListener("click", result)
    document.getElementById("clearHistory").addEventListener("click", clearHistory)
    $("#clearHistory").hide()
    $('#history').on("click", ".removeSearch", removeHistory)
    $('#history').on("click", ".searchHistory", searchHistory)
}

jQuery(document).ready(setup)
