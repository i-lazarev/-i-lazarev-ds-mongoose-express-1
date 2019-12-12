const express = require("express")
const faker = require("faker")
const mongoose = require("mongoose")
const api = express()

api.use(express.json())

api.listen(3000, () =>{
    console.log("Express started at port 3000")
})

const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    firstName: String,
    lastName: String,
    isAdmin:Boolean
},{versionKey: false})
const User = mongoose.model("users", UserSchema)
mongoose.connect("mongodb://localhost/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})

mongoose.connection.on("open", () => {
    console.log("Mongodb Connection established")
})

api.use((req, res, next) => {
    res.set("ACCESS-CONTROL-ALLOW-ORIGIN", "*");
    res.set("ACCESS-CONTROL-ALLOW-HEADERS", "*");
    res.set("ACCESS-CONTROL-ALLOW-METHODS", "*");
    next();
  });

api.get("/",(req, res, next) =>{
    res.send("Welcome")
})

api.get("/seed",(req, res, next) =>{
    for(i=0; i<5; i++){
        User.create({
            email:faker.internet.email(),
            password:faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            isAdmin:faker.random.boolean()
        })
        .then(user => {console.log(user)})
    }
    res.send ("Users was created")
console.log("Users was created")
})

api.get("/users", (req, res, next) => {
    User.find().then(users => {
        res.send(users)
    })
})

api.get("/users/:id", (req, res, next) => {
    const idParams = req.params.id
    User.findById(idParams).then(user => {
        res.send(user)
    })
})

api.post("/users", (req, res, next) =>{
    User.create({
        email: req.body.email,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        isAdmin:false
    })
})

api.patch("/users/:id", (req, res, next) =>{
    const idParams = req.params.id
   User.findByIdAndUpdate(idParams,{firstName:req.body.firstName, lastName:req.body.lastName}).then(user =>{
       res.send(user)
   })
})

api.delete("/users/:id", (req, res, next) =>{
    const idParams = req.params.id
    User.findByIdAndDelete(idParams).then(user=>{
        res.send(`User deleted: ${user}`)
    })
})