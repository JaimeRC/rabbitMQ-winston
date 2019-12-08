const TAG = '[PRODUCER] -> Rpc'

const uuid = require('uuid')

let channel = null           // Canal
let queue = null             // Cola
let correlationId = null     // Identificador unico para el mensaje

/**
 * RabbitMQ - Método RPC
 */
module.exports = class Rpc {

    static async createQueuesByRPC(ch) {
        try {
            if (!channel) channel = ch

            const q = await channel.assertQueue('', {exclusive: true})

            queue = q.queue
            correlationId = uuid.v4() // Identificador unico para este servicio

            console.log(' [*] Created queues in RPC method: ', queue, correlationId)

            channel.consume(q.queue, this.getServiceResults, {noAck: false});

            setTimeout(() => this.sendToService('HOLA CARACOLA'), 3000)
        } catch (e) {
            console.log(TAG, ' -> createQueuesByRPC -> ', e.message)
            throw e
        }
    }

    static async sendToService(data) {
        try {
            let opts = {correlationId, replyTo: queue}
            await channel.sendToQueue('rpc_queue', Buffer.from(data.toString()), opts);

        } catch (e) {
            console.log(TAG, ' -> sendToService -> ', e.message)
            throw e
        }
    }

    static async getServiceResults(msg) {
        try {
            if (msg.properties.correlationId == correlationId) {
                console.log('[.] Got% s', msg.content.toString());

                await channel.ack(msg);
            }
        } catch (e) {
            console.log(TAG, ' -> getServiceResults -> ', e.message)
        }
    }

}