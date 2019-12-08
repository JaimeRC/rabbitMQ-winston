const TAG = '[CONSUMER] -> '
const amqp = require('amqplib');

const {env: {URL_RABBIT}} = process

const {Logs, Job} = require('./consumers')

let amqpConn = null;    // Conexion RabbitMQ

class RabbitMQ {

    static async createConnection() {
        try {
            if (amqpConn) return
            amqpConn = await amqp.connect(URL_RABBIT)

            console.log(`RabbitMQ connected in ${URL_RABBIT}`)
            let channel = await amqpConn.createChannel()

            Logs.subscribeLogs(channel)

            Job.subscribeJobQueue(channel)

        } catch (error) {
            console.log(TAG, 'createConnection -> ', error.message)
            this.closeConnection()
        }
    }

    static async closeConnection() {
        if (amqpConn)
            await amqpConn.close()
        process.exit(1)
    }
}

RabbitMQ.createConnection()
