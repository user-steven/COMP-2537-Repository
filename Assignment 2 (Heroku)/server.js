const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))

app.listen(process.env.PORT || 5100, function (err) {
    if (err)
        console.log(err)
})

mongoose.connect("mongodb+srv://steven:qFoNHGmAl2u6YS4Z@cluster0.qcq3i.mongodb.net/PokedexClient?retryWrites=true&w=majority",
 {useNewUrlParser: true, useUnifiedTopology: true})


 const timelineModel = new mongoose.Schema({
     
 })

 
 app.get('/timeline', (req, res) =>{
     res.render(__dirname + "/views/timeline.ejs")
 })