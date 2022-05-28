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
    userId: String,
    name: String,
    search_event: String,
    date: Date,
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
    admin: Boolean
}, {
    versionKey: false
})

const cartSchema = new mongoose.Schema({
    userId: String,
    pokemonId: Number,
    imgSource: String,
    pokemonName: String,
    backgroundColor: String,
    price: Number,
    quantity: Number
}, {
    versionKey: false
})

const orderSchema = new mongoose.Schema({
    userId: String,
    date: Date,
    order: {}
}, {
    versionKey: false
})

const timelineModel = mongoose.model("timeline", timelineSchema)
const userModel = mongoose.model("user", userSchema)
const cartModel = mongoose.model("cart", cartSchema)
const orderModel = mongoose.model("order", orderSchema)

app.get("/", authorization, (req, res) => {
    res.render(__dirname + "/public/index.ejs")
})

app.get("/cart", authorization, async (req, res) => {
    cart = await cartModel.find({ userId: req.session.user })
    res.render(__dirname + "/public/cart.ejs", {
        cart: cart
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

    await userModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email.toLowerCase().trim(),
        password: hash_password,
        admin: false
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

    userModel.exists({ email }, async (err, result) => {
        if (result) {
            const user = await userModel.findOne({ email })
            if (await bcrypt.compare(password, user.password)) {
                req.session.authenticated = true
                req.session.user = user.id
                req.session.name = user.firstName
                console.log("Login successful")
                res.redirect("/profile")
            }
            else {
                res.send("Incorrect Email or Password")
            }
        }
        else {
            res.send("Incorrect Email or Password")
        }
    })
})

app.get("/logout", (req, res) => {
    req.session.authenticated = false
    console.log("User has been logged out")
    res.redirect("/profile")
})

app.get("/timeline", authorization, (req, res) => {
    res.render(__dirname + "/public/timeline.ejs", {
        name: req.session.name
    })
})

app.post("/api/addToCart", authorization, async (req, res) => {

    await cartModel.exists({
        $and: [{
            userId: req.session.user
        }, {
            pokemonId: req.body.pokemonId
        }]
    }, async (err, result) => {
        if (result) {
            await cartModel.findOneAndUpdate(
                { $and: [{ userId: req.session.user }, { pokemonId: req.body.pokemonId }] },
                { $inc: { quantity: req.body.quantity } }
            )
            console.log("Item already exists in cart. Updating quantity.")
            res.status(204).send()
        } else {
            await cartModel.create(
                {
                    userId: req.session.user,
                    pokemonId: req.body.pokemonId,
                    imgSource: req.body.imgSource,
                    pokemonName: req.body.pokemonName,
                    backgroundColor: req.body.backgroundColor,
                    price: req.body.price,
                    quantity: req.body.quantity
                }
            )
            console.log("Item added to cart.")
            res.status(204).send()
        }
    })
})

app.post("/api/updateCardQuantity", authorization, async (req, res) => {
    await cartModel.findOneAndUpdate(
        { $and: [{ userId: req.session.user }, { pokemonId: req.body.pokemonId }] },
        {quantity: req.body.quantity}
    )
    console.log("User has updated item in cart")
    res.redirect("/cart")
})


app.get("/api/removeCartItem/:id", authorization, async (req, res) => {
    await cartModel.remove({
        "_id": req.params.id
    }).then((result) => {
        console.log("User removed item from cart")
        res.send("Pokemon card removed from cart.")
    }).catch((err) => {
        console.log(err)
    })
})

// checkout user
app.get("/api/checkout", authorization, async (req, res) =>{

    await cartModel.exists({userId: req.session.user}, async (err, result) => {
        if (result) {
            checkoutItems = await cartModel.find({ 
                userId: req.session.user
            },{
                userId: 0,
                _id: 0
            })
            
            await orderModel.create({
                userId: req.session.user,
                date: new Date(),
                order: checkoutItems
            })
            await cartModel.deleteMany({
                userId: req.session.user
            })
            console.log("User successfully checkedout")
            res.render(__dirname + "/public/thankyou.ejs")
        } else {
            console.log("Cart is empty")
            res.send("Cart is Empty")
        }
    })
})

// load profile
app.get('/profile', authorization, async (req, res) => {
    timeline = await timelineModel.find({userId: req.session.user}).sort({date: -1}).limit(5)
    orders = await orderModel.find({userId: req.session.user}).sort({date: -1}).limit(5)
    // console.log(orders)
    // console.log(timeline)
    console.log("Profile page loaded")
    res.render(__dirname + "/public/profile.ejs", {
        timeline: timeline,
        orders: orders,
        name: req.session.name
    })
})

// read all timeline
app.get('/timeline/getAllEvents', authorization, async (req, res) => {
    await timelineModel.find({ 
        userId: req.session.user
    }).then((result) => {
        res.send(result)
        console.log("User viewed all timeline posts")
    }).catch((err) => {
        console.log(err)
    })
})

// create timeline
app.put('/timeline/insert', authorization, async (req, res) => {
    await timelineModel.create({
        userId: req.session.user,
        name: req.session.name,
        search_event: req.body.search_event,
        date: new Date(),
        time_event: req.body.time_event,
        like_counter: req.body.like_counter
    }).then((result) => {
        console.log("User action has been logged successfully")
        res.send("User action has been logged successfully")
    }).catch((err) => {
        console.log(err)
    })
})

// update timeline
app.get('/timeline/update/:id', authorization, async (req, res) => {
    await timelineModel.updateOne({
        "_id": req.params.id
    }, {
        $inc: { like_counter: 1 }
    }).then((result) => {
        console.log("User liked a timeline post")
        res.send("User liked a timeline post")
    }).catch((err) => {
        console.log(err)
    })
})

// delete timeline
app.get('/timeline/delete/:id', authorization, async (req, res) => {
    await timelineModel.deleteOne({
        "_id": req.params.id
    }).then((result) => {
        console.log("User deleted timeline post")
        res.send("User deleted timeline post")
    }).catch((err) => {
        console.log(err)
    })
})


