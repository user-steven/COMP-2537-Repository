const COLORS = {
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

const cardsPerPage = 9
var listOfPokemonUrls = []
var currentPage = 1
var numOfPages = null

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
    $('#pokemonGallery').empty()
    resetPagination()
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


function generateBackgroundColor(pokemon) {
    return COLORS[pokemon.types[0].type.name]
}


function createPokemonCard(pokemon) {
    let pokemonGallery = document.getElementById('pokemonGallery')
    let backgroundColor = generateBackgroundColor(pokemon)
    pokemonCard =
        `<button type="button" id="${pokemon.id}" class="pokemonCardButton" onclick="generatePokemonProfile(this.id)"><div class='pokemonCard' style="background: ${backgroundColor};">
    <div class='imgContainer'><img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}"></div>

    <div class="cardContent">
    <p class="cardTitle">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</p>
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

    showPages(typeResult.pokemon.length, cardsPerPage)

    for (i = 0; i < typeResult.pokemon.length; i++) {
        listOfPokemonUrls.push(typeResult.pokemon[i].pokemon.url)
    }

    populatePage(currentPage, listOfPokemonUrls)
}

async function searchByAbility(ability) {
    let res = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
    let abilityResult = await res.json()

    showPages(abilityResult.pokemon.length, cardsPerPage)

    for (i = 0; i < abilityResult.pokemon.length; i++) {
        listOfPokemonUrls.push(abilityResult.pokemon[i].pokemon.url)
    }

    populatePage(currentPage, listOfPokemonUrls)
}

function searchTermValidation(searchTerm) {
    var letters = /^[A-Za-z\s\-]*$/
    // console.log(letters.test(searchTerm))
    return letters.test(searchTerm)
}

function result() {
    $("#historyContainer").show()
    resetPagination()
    let searchType = document.querySelector("#searchType").value
    let input = document.querySelector("#searchBox").value
    // if (!isNaN(input))
    if (!searchTermValidation(input) || input == "")
        return alert("Please enter a valid search term. [letters, spaces, -] only!")
    else {
        input = input.trim().toLowerCase().replaceAll(' ', '-')
        document.getElementById("history").innerHTML += `<span>Type: ${searchType} Input: ${input}<button type="button" class="searchHistory styledButton"> search</button><button type="button" class="removeSearch styledButton"> remove</button><br></span>`
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
    resetPagination()
    let searchTerms = $(this).parent().text().split(" ")
    // console.log(searchTerms)
    let searchType = searchTerms[1]
    let input = searchTerms[3].trim().toLowerCase().replaceAll(' ', '-')

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

function findStat(pokemon, stat) {
    stat = pokemon.stats.filter((obj_) => {
        return obj_.stat.name == stat
    }).map((obj__) => {
        return obj__.base_stat
    })
    return stat[0]
}

function appendType(array_) {
    array_.forEach((item) => {
        document.querySelector(".types").innerHTML += (`<span>${item.type.name[0].toUpperCase() + item.type.name.slice(1)}</span>`)
    })
}

async function generatePokemonProfile(id) {
    console.log(id)
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let pokemon = await res.json()
    console.log(pokemon)
    $("#pokemonProfile").empty()
    let hp = findStat(pokemon, "hp")
    let imgSource = pokemon.sprites.other["official-artwork"].front_default
    let pokemonName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    let statAttack = findStat(pokemon, "attack")
    let statDefense = findStat(pokemon, "defense")
    let statSpeed = findStat(pokemon, "speed")
    let backgroundColor = generateBackgroundColor(pokemon)
    // console.log(`${pokemonName}\n${hp}\n${imgSource}\n${statAttack}\n${statDefense}\n${statSpeed}\n${backgroundColor}`)
    let pokemonProfileContainer = document.getElementById('pokemonProfileContainer')
    let pokemonProfile = document.getElementById('pokemonProfile')
    pokemonProfile.style.background = backgroundColor
    pokemonProfile.innerHTML += `
    <span class="pokemonProfileClose">&times;</span>
    <div><img src=${imgSource}></div>
    <p id="hp"><span>HP </span>${hp}</p>
    <h2 class="cardTitle">${pokemonName}</h2>
    <h3 class="types"></h3><p>Type(s)</p>
    <h3>${statAttack}</h3><p>Attack</p>
    <h3>${statDefense}</h3><p>Defense</p>
    <h3>${statSpeed}</h3><p>Speed</p>`
    appendType(pokemon.types)
    let pokemonProfileClose = document.querySelector('.pokemonProfileClose')
    pokemonProfileContainer.classList.add('pokemonProfileActive')
    pokemonProfileClose.addEventListener("click", function () {
        pokemonProfileContainer.classList.remove('pokemonProfileActive')
    })
}

function clearHistory() {
    $("#history").empty()
    $("#historyContainer").hide()
}

function triggerSearch() {
    document.getElementById('searchBox').addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            document.getElementById("searchBoxSubmit").click()
        }
    })
}

function showPages(size, cardsPerPage) {
    if (size > cardsPerPage) {
        paginate(size, cardsPerPage)
        $("#pagination").show()
        document.getElementById('currentPage').textContent = `Current Page: ${currentPage}`
        $("#currentPage").show()
    }
    else {
        $("#pagination").hide()
        $("#currentPage").hide()
    }
}

function resetPagination() {
    $("#pagination").empty()
    listOfPokemonUrls.length = 0
    currentPage = 1
    numOfPages = null
    $("#pagination").hide()
    $("#currentPage").hide()
}

function paginate(size, cardsPerPage) {
    numOfPages = Math.ceil(size / cardsPerPage)
    pageDiv = document.getElementById('pagination')
    pageDiv.innerHTML += "<span>Pages:</span>"
    pageDiv.innerHTML += "<button class='styledButton pageButton'>First</button>"
    pageDiv.innerHTML += "<button class='styledButton pageButton'>Prev</button>"
    for (i = 1; i < numOfPages + 1; i++) {
        pageDiv.innerHTML += `<button class='styledButton pageButton pageButtonStyle'>${i}</button>`
    }
    pageDiv.innerHTML += "<button class='styledButton pageButton'>Next</button>"
    pageDiv.innerHTML += "<button class='styledButton pageButton'>Last</button>"
}

function populatePage(currentPage, listOfPokemonUrls) {
    $('#pokemonGallery').empty()
    let startIndex = cardsPerPage * (currentPage - 1)
    let stopIndex = startIndex + cardsPerPage
    for (i = startIndex; i < stopIndex; i++) {
        getPokemon(listOfPokemonUrls[i])
    }
}

function moveToPage() {
    if ($(this).text() == "First") {
        if (currentPage != 1) {
            currentPage = 1
            populatePage(currentPage, listOfPokemonUrls)
        }
    }
    else if ($(this).text() == "Last") {
        if (currentPage != numOfPages) {
            currentPage = numOfPages
            populatePage(currentPage, listOfPokemonUrls)
        }
    }
    else if ($(this).text() == "Prev") {
        if (currentPage > 1) {
            currentPage -= 1
            populatePage(currentPage, listOfPokemonUrls)
        }
    }
    else if ($(this).text() == "Next") {
        if (currentPage < numOfPages) {
            currentPage += 1
            populatePage(currentPage, listOfPokemonUrls)
        }
    }
    else {
        currentPage = parseInt($(this).text())
        populatePage(currentPage, listOfPokemonUrls)
    }
    document.getElementById('currentPage').textContent = `Current Page: ${currentPage}`
}

function setup() {
    getRandomNinePokemon()
    document.getElementById("searchBoxSubmit").addEventListener("click", result)
    document.getElementById("clearHistory").addEventListener("click", clearHistory)
    $("#historyContainer").hide()
    $("#pagination").hide()
    $("#currentPage").hide()
    $('#history').on("click", ".removeSearch", removeHistory)
    $('#history').on("click", ".searchHistory", searchHistory)
    $("#pagination").on("click", ".pageButton", moveToPage)
    triggerSearch()

    window.onclick = function(event) {
        if (event.target == document.getElementById('pokemonProfileContainer')) {
            document.getElementById('pokemonProfileContainer').classList.remove('pokemonProfileActive');
        }
      }
}

$(document).ready(setup)
