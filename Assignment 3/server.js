const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
const cors = require('cors')

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(cors())
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


const timelineSchema = new mongoose.Schema({
     search_event: String,
     time_event: String,
     like_counter: Number
 }, {
     versionKey: false
 })

 const userSchema = new mongoose.Schema({
     email: String,
     password: String,
     cart: Array
 }, {
    versionKey: false
})

const timelineModel = mongoose.model("timeline", timelineSchema)
const userModel = mongoose.model("user", userSchema)

app.get("/", (req, res) =>{
    res.render(__dirname + "/public/index.ejs")
})

app.get("/timeline", (req, res) =>{
    res.sendFile(__dirname + "/public/timeline.html")
})

// read
 app.get('/timeline/getAllEvents', (req, res) =>{
     timelineModel.find().then((result) =>{
         res.send(result)
     }).catch((err) =>{
         console.log(err)
     })
 })

// create
 app.put('/timeline/insert', (req, res) =>{
    timelineModel.create({
        search_event: req.body.search_event,
        time_event: req.body.time_event,
        like_counter: req.body.like_counter
    }).then((result) => {
        // console.log(result)
        res.send("Client search has been logged successfully")
    }).catch((err) =>{
        console.log(err)
    })
})

// update
app.get('/timeline/update/:id', (req, res) =>{
    timelineModel.updateOne({
        "_id" : req.params.id
    }, {
        $inc: {like_counter: 1}
    }).then((result) =>{
        // console.log(result)
        res.send("Like counter has incremented successfully")
    }).catch((err) =>{
        console.log(err)
    })
})

// delete
app.get('/timeline/delete/:id', (req, res) =>{
    timelineModel.remove({
        "_id" : req.params.id
    }).then((result) =>{
        // console.log(result)
        res.send("Deleted timeline post successfully")
    }).catch((err) =>{
        console.log(err)
    })
})
