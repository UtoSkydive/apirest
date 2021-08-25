const express = require('express')
const morgan = require('morgan')
const personarutas = require('./src/routes/personas.routes')
const cors = require('cors');
const app = express()
app.set('port',process.env.PORT || 3000)


app.use(morgan('dev'))
app.use(express.json())
app.use(personarutas)
app.use(cors());


module.exports = app