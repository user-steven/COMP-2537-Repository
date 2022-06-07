var firstCard = null
var secondCard = null
var firstCardFlipped = false

var gameWidth = null
var gameHeight = null
var pokemonCount = null
var randomPokemon = null
var neededPokemonCount = null
var pokemonCardArray = null

var gameId = null


async function logGame() {
    await $.ajax({
        url: "/api/game",
        type: "put",
        data: {
            gameBoard: `${gameWidth} x ${gameHeight}`,
            pokemonCount: pokemonCount
        },
        success: (result) => {
            gameId = result._id
            $("#gameOptionButton").prop('disabled', false)
        }
    })
}

async function winGame() {
    await $.ajax({
        url: `/api/game/${gameId}`,
        type: "get"
    })
}

function gameOption() {
    $("#gameOption").submit((event) => {
        event.preventDefault()

        $("#gameOptionButton").prop('disabled', true)

        gameWidth = parseInt($("#width").val())
        gameHeight = parseInt($("#height").val())
        pokemonCount = parseInt($("#pokemonCount").val())
        randomPokemon = generateRandomPokemon(pokemonCount)
        neededPokemonCount = (gameWidth * gameHeight) / 2
        pokemonCardArray = shuffleArray(generatePokemonCards(randomPokemon, neededPokemonCount, gameWidth, gameHeight))

        logGame()

        $("#gameGrid").html(pokemonCardArray)
        $(".card").on("click", flip)
    })
}

function generatePokemonCards(pokemonId, requiredPokemonCount, width, height) {
    let count = 0
    let index = 0
    let pokemonCardArray = []

    while (count < requiredPokemonCount) {
        if (index == pokemonId.length) {
            index = 0
        } else {
            // console.log("count:" + count + " pokemon ID: " + randomPokemon[index])
            card_1 = `
            <div class="card" style="height: calc(${100 / height}% - 5px); width: calc(${100 / width}% - 5px);">
                <img class="frontFace" id="${Math.floor(Math.random() * 1000000000)}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId[index]}.png">
                <img class="backFace" src="./images/back.png">
            </div>`
            card_2 = `
            <div class="card" style="height: calc(${100 / height}% - 5px); width: calc(${100 / width}% - 5px);">
                <img class="frontFace" id="${Math.floor(Math.random() * 10000000000)}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId[index]}.png">
                <img class="backFace" src="./images/back.png">
            </div>`
            pokemonCardArray.push(card_1)
            pokemonCardArray.push(card_2)
            index++
            count++
        }
    }
    return pokemonCardArray
}

function generateRandomPokemon(count) {
    let set = new Set()
    while (set.size < count) {
        set.add(Math.floor(Math.random() * (899 - 1) + 1))
    }
    return Array.from(set)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array
}

function flip() {
    $(this).toggleClass("flip")
    $(this).off("click")
    if (!firstCardFlipped) {
        firstCard = $(this).find(".frontFace")[0]
        firstCardFlipped = true
    } else {
        secondCard = $(this).find(".frontFace")[0]
        firstCardFlipped = false
        checkCards(firstCard, secondCard)
    }
}

function checkCards(firstCard, secondCard) {
    $("#gameGrid").addClass("disableClick")
    if (
        $(`#${firstCard.id}`).attr("src")
        ==
        $(`#${secondCard.id}`).attr("src")
    ) {
        console.log("a match!")
        $(`#${firstCard.id}`).parent().off("click")
        $(`#${secondCard.id}`).parent().off("click")
        $("#gameGrid").removeClass("disableClick")
    } else {
        setTimeout(() => {
            $(`#${firstCard.id}`).parent().removeClass("flip")
            $(`#${secondCard.id}`).parent().removeClass("flip")
            $(`#${firstCard.id}`).parent().on("click", flip)
            $(`#${secondCard.id}`).parent().on("click", flip)
            $("#gameGrid").removeClass("disableClick")
        }, 500)
    }

    if (document.getElementsByClassName("flip").length == (gameWidth * gameHeight)) {
        winGame()
        setTimeout(() => {
            alert("You win!")
        }, 500)
    }
}

function quitGame() {
    $("#quitGame").prop("disabled", true)
    if (document.getElementsByClassName("flip").length != (gameWidth * gameHeight)) {
        alert("You lose.")
    }
    window.location.reload(true)
}

function setup() {
    $("#gameOptionButton").on("click", gameOption)
    $("#quitGame").on("click", quitGame)
}

$(document).ready(setup)