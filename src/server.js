const express = require('express')
const app = express()
const path = require('path')
const {users} = require('./db/models')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'hbs')
app.set('views', __dirname+ '/views')
app.use(express.static(path.join(__dirname, 'views')))

//landing page
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/landingpg.html')
})

app.get('/login', (req,res)=>{
    res.sendFile(__dirname+'/views/login.html')
})

app.get('/signup', (req,res)=>{
    res.sendFile(__dirname+'/views/signup.html')
})

app.post('/signupusers', async(req,res)=>{
    await users.create({
        name: req.body.name,
        username: req.body.username,
        emailId: req.body.email,
        Password: req.body.password,
        Gender: req.body.gender,
        DOB: req.body.dob,
        img: req.body.img
    }).then(()=>{res.sendFile(__dirname + '/views/login.html')})
      .catch((e)=>{console.log(e)})
})

app.post('/loginusers', async(req,res)=>{
    let details = await users.findOne({
        where:{
            username: req.body.uid,
            Password: req.body.password
        }
    })
    if(details){
        res.render('accountspg',{
            details
        })
    }
    else{
        res.send(`<h1>Login unsuccessfull</h1>`)
    }
})

exports = module.exports = {
    app
}