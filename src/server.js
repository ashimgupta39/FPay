const express = require('express')
const app = express()
const path = require('path')
const { sequelize } = require('./db/connections')
const { Op } = require("sequelize");
const {users,Transactions} = require('./db/models')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'hbs')
app.set('views', __dirname+ '/views')
app.use(express.static(path.join(__dirname, 'views')))
var Handlebars = require('hbs')
Handlebars.registerHelper('isEqual', function (value1, value2) {
    return value1 == value2;
  });
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
        img: req.body.img,
        balance: req.body.balance
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
        let transhistory = await Transactions.findAll({
            where: {
                [Op.or]: [
                    {from: req.body.uid},
                    {to: req.body.uid}
                ]
            }
        })
        // let transfrom = await histories.findAll({
        //     where: {
        //         from: req.body.uid
        //     }
        // })
        // let transto = await histories.findAll({
        //     where: {
        //         to: req.body.uid
        //     }
        // })
        res.render('accountspg',{
            details,transhistory
        })
    }
    else{
        res.send(`<h1>Login unsuccessfull</h1>`)
    }
})

app.get('/pay', (req,res)=>{
    const uname=req.query.uid
    res.render('payment', {
        uname
    })
})

app.post('/transaction', async(req,res)=>{
    let payer= await users.findOne({
        where:{
            username: req.body.from
        }
    })
    let bal=payer.balance
    if(bal>=req.body.amount){
        bal=bal-req.body.amount
        await payer.update({
            balance:bal
        })
    let payee = await users.findOne({
        where:{
            username: req.body.to
        }
    })
    let bal1=payee.balance
    bal1 = parseInt(bal1) + parseInt(req.body.amount)
    await payee.update({
        balance: bal1
    })

    await Transactions.create({
        amount: req.body.amount,
        from: req.body.from,
        to: req.body.to,
        senderbalance: bal,
        recieverbalance: bal1,
        time: sequelize.fn('NOW')
    })
    res.send(`<h1>Payment successfull</h1>`)
    }
    else{
        res.send(`<h1>Insufficient Balance</h1>`)
    }
    
})
exports = module.exports = {
    app
}