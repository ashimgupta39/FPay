const {db, sequelize} = require('./connections')
const datatypes = sequelize.DataTypes

const users = db.define('Users',{
    name: {
        type: datatypes.STRING(300),
        allowNull: false
    },
    username: {
        type: datatypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    emailId: {
        type: datatypes.STRING,
        allowNull: false,
        isEmail: true
    },
    Password: {
        type: datatypes.STRING(64),
        allowNull: false,
        is: /^[0-9a-f]{64}$/i
    },
    Gender: {
        type: datatypes.STRING,
        allowNull: false
    },
    DOB: {
        type: datatypes.DATE,
        allowNull: false
    },
    img: {
        type: sequelize.BLOB('long'),
        allowNull: false
    },
    balance: {
        type: datatypes.INTEGER,
        allowNull:false
    }
});

const Transactions = db.define('History',{
    amount: {
        type: datatypes.INTEGER,
        allowNull:false
    },
    time: {
        type: datatypes.DATE,
        // allowNull:false
    },
    from: {
        type: datatypes.STRING,
        allowNull: false
    },
    to: {
        type: datatypes.STRING,
        allowNull: false
    },
    senderbalance: {
        type: datatypes.INTEGER,
        allowNull:false
    },
    recieverbalance: {
        type: datatypes.INTEGER,
        allowNull:false
    }
})

db.sync({ alter: true })
    .then (() => console.log("database synchronized"))
    .catch( (err) => console.log(err))

module.exports = {
    users,db,Transactions
}