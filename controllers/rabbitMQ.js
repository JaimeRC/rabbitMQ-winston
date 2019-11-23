const {URL_RABBIT} = require('../config/env.js').getArgvs()
const amqp = require('amqplib');

let amqpConn = null;    // Conexion RabbitMQ
let channel = null;     // Channel

module.exports = class RabbitMQ {

    async static createConnection() {
        if (amqpConn) return
        amqpConn = await amqp.connect(URL_RABBIT)

        console.log(`RabbitMQ connected in ${URL_RABBIT}`)
    }

    async static subscribe(queue) {
        if (!amqpConn)
            createConnection()

        channel = await amqpConn.createChannel()
        await channel.assertQueue(queue, {durable: false})
        channel.consume(queue, (msg) => {

            const message = JSON.parse(msg.content.toString());

        }, {noAck: true, consumerTag: queue})
    }

    async static unsubscribe(queue) {
        if (amqpConn && channel && queue)
            await channel.cancel(queue)

    }

    async static sendMessage(queue, message) {
        await channel.sendToQueue(queue, Buffer.from(message), {consumerTag: queue});
    }

    async static closeConnection() {
        if (amqpConn)
            await amqpConn.close()
    }
}