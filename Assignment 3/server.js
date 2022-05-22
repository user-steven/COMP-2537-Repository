const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
const cors = require('cors')
const bcrypt = require('bcrypt')
var session = require('express-session')

app.set('view engine', 'ejs')

app.use(session({ secret: 'pokemonapp', saveUninitialized: true, resave: true }))
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

function authorization(req, res, next) {
    if (req.session.authenticated) {
        console.log("User is logged in")
        next()
    }
    else {
        console.log("User is not logged in")
        res.redirect("/login")
    }
}

mongoose.connect("mongodb+srv://steven:qFoNHGmAl2u6YS4Z@cluster0.qcq3i.mongodb.net/PokedexClient?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })


const timelineSchema = new mongoose.Schema({
    search_event: String,
    time_event: String,
    like_counter: Number
}, {
    versionKey: false
})

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: String,
    admin: Boolean,
    cart: Array,
    orders: Array
}, {
    versionKey: false
})

const timelineModel = mongoose.model("timeline", timelineSchema)
const userModel = mongoose.model("user", userSchema)

app.get("/", authorization, (req, res) => {
    res.render(__dirname + "/public/index.ejs")
})

app.get("/profile", authorization, async (req, res) => {
    user = await userModel.findOne({ _id: req.session.user })

    res.render(__dirname + "/public/profile.ejs", {
        name: user.firstName,
        cart: user.cart,
        orders: user.orders
    })
})


app.get("/login", (req, res) => {
    if (req.session.authenticated)
        res.redirect("/profile")
    else
        res.render(__dirname + "/public/login.ejs")
})

app.get("/register", (req, res) => {
    if (req.session.authenticated)
        res.redirect("/profile")
    else
        res.render(__dirname + "/public/register.ejs")
})

app.post("/api/register", async (req, res) => {
    hash_password = await bcrypt.hash(req.body.password, 1)

    userModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email.toLowerCase().trim(),
        password: hash_password,
        admin: false,
        cart: [],
        orders: []
    }).then((result) => {
        // console.log(result)
        res.redirect("/login")
    }).catch((err) => {
        console.log(err)
        if (err.code == 11000)
            res.send("User already registered")
    })
})

app.post("/api/login", (req, res) => {
    email = req.body.email.toLowerCase().trim()
    password = req.body.password

    userModel.exists({email}, async (err, result) => {
        if (result) {
            const user = await userModel.findOne({ email })
            if (await bcrypt.compare(password, user.password)) {
                req.session.authenticated = true
                req.session.user = user.id
                console.log("Login successful")
                res.redirect("/profile")
            }
            else {
                res.send("Incorrect Email or Password")
            }
        }
        else {
            res.send("User does not exist")
        }
    })
})

app.get("/logout", (req, res) => {
    req.session.authenticated = false
    console.log("User has been logged out")
    res.redirect("/profile")
})

app.get("/timeline", (req, res) => {
    res.render(__dirname + "/public/timeline.ejs")
})

// read
app.get('/timeline/getAllEvents', (req, res) => {
    timelineModel.find().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})

// create
app.put('/timeline/insert', (req, res) => {
    timelineModel.create({
        search_event: req.body.search_event,
        time_event: req.body.time_event,
        like_counter: req.body.like_counter
    }).then((result) => {
        // console.log(result)
        res.send("Client search has been logged successfully")
    }).catch((err) => {
        console.log(err)
    })
})

// update
app.get('/timeline/update/:id', (req, res) => {
    timelineModel.updateOne({
        "_id": req.params.id
    }, {
        $inc: { like_counter: 1 }
    }).then((result) => {
        // console.log(result)
        res.send("Like counter has incremented successfully")
    }).catch((err) => {
        console.log(err)
    })
})

// delete
app.get('/timeline/delete/:id', (req, res) => {
    timelineModel.remove({
        "_id": req.params.id
    }).then((result) => {
        // console.log(result)
        res.send("Deleted timeline post successfully")
    }).catch((err) => {
        console.log(err)
    })
})
