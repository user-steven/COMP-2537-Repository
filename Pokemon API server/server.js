const express = require('express');
const { type } = require('express/lib/response');
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())

app.listen(process.env.PORT || 5100, function (err) {
    if (err)
        console.log(err);
})

mongoose.connect("mongodb+srv://steven:qFoNHGmAl2u6YS4Z@cluster0.qcq3i.mongodb.net/Pokemon?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })

const pokemonSchema = new mongoose.Schema({
    abilities: Array,
    base_experience: Number,
    forms: Array,
    game_indices: Array,
    height: Number,
    held_items: Array,
    id: Number,
    is_default: Boolean,
    location_area_encounters: String,
    moves: Array,
    name: String,
    order: Number,
    species: {},
    sprites: {},
    stats: Array,
    types: Array,
    weight: Number
})

const typeSchema = new mongoose.Schema({
    damage_relations: {},
    game_indices: Array,
    generation: Object,
    id: Number,
    move_damage_class: {},
    moves: Array,
    name: String,
    names: Array,
    past_damage_relations: Array,
    pokemon: Array
})

const abilitySchema = new mongoose.Schema({
    name: String,
    url: String
})

const pokemonModel = mongoose.model("pokemons", pokemonSchema)
const typeModel = mongoose.model("types", typeSchema)
const abilityModel =mongoose.model("abilities", abilitySchema)

app.get('/pokemon', async (req, res) =>{
    await pokemonModel.find().then((result) =>{
        res.send(result)
    }).catch((err) =>{
        console.log(err)
    })
})

// app.get('/pokemon/:input', (req, res) =>{
//     pokemonModel.find({$or: [{name : req.params.input}, {id : req.params.input}]
//     }).then((result) =>{
//         res.send(result)
//     }).catch((err) =>{
//         console.log(err)
//     })
// })

app.get('/pokemon/name/:name', async (req, res) =>{
    await pokemonModel.find({
        name: req.params.name
    }).then((result) =>{
        res.send(result[0])
    }).catch((err) =>{
        console.log(err)
    })
})

app.get('/pokemon/id/:id', async (req, res) =>{
    await pokemonModel.find({
        id: req.params.id
    }).then((result) =>{
        res.send(result[0])
    }).catch((err) =>{
        console.log(err)
    })
})

app.get('/type/:type', async (req, res) =>{
    await typeModel.find({
        name: req.params.type
    }).then((result) =>{
        res.send(result[0])
    }).catch((err) =>{
        console.log(err)
    })
})

app.get('/ability/:ability', async (req, res) =>{
    await abilityModel.find({
        name: req.params.ability
    }).then((result) =>{
        res.redirect(result[0].url)
    }).catch((err) =>{
        console.log(err)
    })
})
