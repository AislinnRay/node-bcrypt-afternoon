require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')


app.use(express.json())
app.use(
    session({
        resave:false,
        saveUninitialized: true,
        secret: SESSION_SECRET,
        // cookie: {maxAge: 1000 * 60 * 60 * 24}
    })
)

//Session demonstration endpoint


//Auth endpoints
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

//Secret stuff

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false},
}).then((db) => {
    app.set('db', db)
    console.log('DB running')
    app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`))
})