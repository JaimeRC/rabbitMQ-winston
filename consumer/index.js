const {RabbitMQ} = require('./controllers')

const start = async () => {
    await RabbitMQ.createConnection()
}

start()