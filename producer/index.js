const {env: {NODE_ENV, PORT_EXPRESS}} = process

//RabbitMQ
const RabbitMQ = require('./config/RabbitMQ')

//Morgan
const morgan = require('morgan')

//Express
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//Routes
const routes = require('./routes')

//Traceability
if (NODE_ENV === 'local_devel') app.use(morgan('dev'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check', (req, res) => res.send({status: true, message: 'Check OK'}))

app.use('/', routes)

app.listen(PORT_EXPRESS, () => {
    RabbitMQ.createConnection()
    console.log(`Server init in port ${PORT_EXPRESS}`)
})
