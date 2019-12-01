const {env: {URL_RABBIT}} = process

const amqp = require('amqplib');

let amqpConn = null;    // Conexion RabbitMQ
let channel = null;     // Channel
let exchange = 'logs'   // Exchange

module.exports = class RabbitMQ {

    static async createConnection() {
        try {
            if (amqpConn) return
            amqpConn = await amqp.connect(URL_RABBIT)
            channel = await amqpConn.createChannel();
            console.log(`RabbitMQ connected in ${URL_RABBIT}`)
            await this.createQueues()
        } catch (e) {
            console.log(e)
        }
    }

    static async createQueues() {
        // create exchange
        await channel.assertExchange(exchange, "direct", {durable: true});

        // create queues
        await channel.assertQueue("logs.info", {durable: true});
        await channel.assertQueue("logs.error", {durable: true});

        // bind queues
        await channel.bindQueue("logs.info", "logs", "info");
        await channel.bindQueue("logs.error", "logs", "error");
    }

    static async sendMessageInfo(message) {
        let opts = {contentType: 'application/json', persistent: true}
        await channel.publish('logs', 'info', Buffer.from(JSON.stringify(message), 'utf-8'), opts)
        console.log(`Message sent to 'logs.success'.`)
    }

    static async sendMessageError(message) {
        let opts = {contentType: 'application/json', persistent: true}
        await channel.publish('logs', 'error', Buffer.from(JSON.stringify(message), 'utf-8'), opts)
        console.log(`Message sent to 'logs.error'.`)
    }

    static async closeConnection() {
        if (amqpConn)
            await amqpConn.close()
    }
}