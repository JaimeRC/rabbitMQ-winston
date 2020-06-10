const TAG = '[PRODUCER]'
const {env: {URL_RABBIT}} = process

const {routing,rpc} = require('../controllers')

const amqp = require('amqplib');

let amqpConn = null;    // Conexion RabbitMQ

module.exports = class RabbitMQ {

    static async createConnection() {
        try {
            if (amqpConn) return
            amqpConn = await amqp.connect(URL_RABBIT)
            const channel = await amqpConn.createChannel();
            console.log(`RabbitMQ connected in ${URL_RABBIT}`)

            // Routing method
            await routing.createQueuesByRouting(channel)

            // RPC method
            await rpc.createQueuesByRPC(channel)
        } catch (e) {
            console.log(TAG, ' -> createConnection -> ', e.message)
            this.closeConnection()
        }
    }

    /**
     * Cierre de la conexción de RabbitMQ
     */
    static async closeConnection() {
        if (amqpConn)
            await amqpConn.close()
    }
}