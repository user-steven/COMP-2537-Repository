// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${}.png


function gameOption() {
    $("#gameOption").submit((event) => {
        event.preventDefault()
    })

    let gameWidth = parseInt($("#width").val())
    let gameHeight = parseInt($("#height").val())
    let pokemonCount = parseInt($("#pokemonCount").val())

    
}


function setup() {
    document.getElementById("gameOptionButton").addEventListener("click", gameOption)
}

$(document).ready(setup)