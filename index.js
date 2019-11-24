const {NODE_ENV, PORT} = require('./config/env').getArgvs()

//RabbitMQ
const RabbitMq = require('./controllers/rabbitMQ')

//Express
const express = require('express')
const app = express()

//Routes
const routes = require('./routes')

//Traceability
if (NODE_ENV === 'local') app.use(morgan('dev'))

app.use('/', routes)

app.listen(PORT, () => {
    RabbitMq.createConnection()
    console.log(`Server init in port ${PORT}`)
})
