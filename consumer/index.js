const TAG = '[CONSUMER] :: '

const {env: {URL_RABBIT}} = process

const {logger} = require('./controllers')
const amqp = require('amqplib');

let amqpConn = null;    // Conexion RabbitMQ
let channel = null;     // Channel
let exchange = 'logs'   // Exchange
let types = ['info','error']

class RabbitMQ {

    static async createConnection() {
        try {
            if (amqpConn) return
            amqpConn = await amqp.connect(URL_RABBIT)

            console.log(`RabbitMQ connected in ${URL_RABBIT}`)
            channel = await amqpConn.createChannel()

            this.subscribeLogs()
        } catch (error) {
            console.log(TAG, 'createConnection :: ', error.message)
            process.exit(1)
        }
    }

    static async subscribeLogs() {
        try {
            const q = await channel.assertQueue('', {exclusive: true})

            console.log(' [*] Waiting for logs. To exit press CTRL+C')

          types.forEach(function (severity) {
                 channel.bindQueue(q.queue, exchange, severity);
             });

             channel.consume(q.queue, async function (msg) {
                 console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

                 if(msg.fields.routingKey === 'info'){
                     logger.consumeLogInfo(msg.content.toString())
                 }else if (msg.fields.routingKey === 'error'){
                     logger.consumeLogError(msg.content.toString())
                 }

                 await channel.ack(msg);
             }, {
                 noAck: false
             });
        } catch (error) {
            console.log(TAG, 'subscribe :: ', error.message)
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