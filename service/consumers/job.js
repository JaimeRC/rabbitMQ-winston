const TAG = '[CONSUMER] -> Consumers -> Jobs -> '

const {action} = require('../controllers')

let channel = null
let queue = 'rpc_queue';

/**
 * Consumidor para gestionar una peticion y devolverla al Servicio solicitado
 */
module.exports = class Job {
    static async subscribeJobQueue(ch) {
        try {

            if (!channel) channel = ch

            channel.assertQueue(queue, {durable: true});

            channel.prefetch(1);

            console.log(' [*] Awaiting RPC requests');

            channel.consume(queue, function (msg) {
                console.log(TAG, 'content received -> ', msg.content.toString());

                const {properties: {replyTo, correlationId}, content} = msg

                action(replyTo, correlationId, content.toString())

                channel.ack(msg);
            });

        } catch (error) {
            console.log(TAG, 'subscribeJobQueue -> ', error.message)
            throw error
        }
    }

    static  sendResultsToService(queue, id, data) {
        try {
            let opts = {correlationId: id}
             channel.sendToQueue(queue, Buffer.from(data.toString()), opts);
        } catch (error) {
            console.log(TAG, 'sendResultsToService -> ', error.message)
            throw error
        }
    }
}