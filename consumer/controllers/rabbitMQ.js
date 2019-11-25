const amqp = require('amqplib');

let amqpConn = null;    // Conexion RabbitMQ
let channel = null;     // Channel
let exchange = 'logs'   //Exchange
let types = ['info', 'error']


module.exports = class RabbitMQ {

    async static createConnection() {
        if (amqpConn) return
        amqpConn = await amqp.connect(URL_RABBIT)

        console.log(`RabbitMQ connected in ${URL_RABBIT}`)
        channel = await amqpConn.createChannel();

        this.subscribe()
    }

    async static subscribe() {
        const q = await channel.assertQueue('', {exclusive: true})

        console.log(' [*] Waiting for logs. To exit press CTRL+C');

        types.forEach(function (severity) {
            channel.bindQueue(q.queue, exchange, severity);
        });

        channel.consume(q.queue, function (msg) {
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        }, {
            noAck: false
        });
    }

    async static closeConnection() {
        if (amqpConn)
            await amqpConn.close()
    }
}