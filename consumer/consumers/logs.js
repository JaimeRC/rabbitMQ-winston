const TAG = '[CONSUMER] -> Consumers -> Logs -> '
const {logger} = require('../controllers')

let channel = null
let exchange = 'logs'   // Exchange
let types = ['info', 'error']

/**
 * Consumidor para Guardar los Logs
 */
module.exports = class Logs {

    static async subscribeLogs(ch) {
        try {
            if (!channel) channel = ch

            const q = await channel.assertQueue('', {exclusive: true})

            console.log(' [*] Waiting for logs.')

            types.forEach((severity) => {
                channel.bindQueue(q.queue, exchange, severity);
            });

            channel.consume(q.queue, async function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

                if (msg.fields.routingKey === 'info') {
                    logger.consumeLogInfo(msg.content.toString())
                } else if (msg.fields.routingKey === 'error') {
                    logger.consumeLogError(msg.content.toString())
                }

                await channel.ack(msg);
            }, {noAck: false});
        } catch (error) {
            console.log(TAG, 'subscribeLogs -> ', error.message)
            throw error
        }
    }
}