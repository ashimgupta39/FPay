const sequelize = require('sequelize')

const db = new sequelize('FacePay', 'administrator', 'mypass', 
{
    host:'localhost',
    dialect: 'mysql'
})

module.exports = {
    db, sequelize
}