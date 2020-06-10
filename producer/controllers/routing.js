const TAG = '[PRODUCER] -> Routing'

let exchange = 'logs'   // Intercambio
let channel = null      // Canal

/**
 * RabbitMQ - Método Routing
 */
module.exports = class Routing {

    static async createQueuesByRouting(ch) {
        try {
            if (!channel) channel = ch

            await channel.assertExchange(exchange, "direct", {durable: true});

            // Creamos las colas
            await channel.assertQueue(`${exchange}.info`, {durable: true});
            await channel.assertQueue(`${exchange}.error`, {durable: true});

            // Blindamos las colas
            await channel.bindQueue(`${exchange}.info`, exchange, "info");
            await channel.bindQueue(`${exchange}.error`, exchange, "error");

            console.log(` [*] Created queues in Routing method: ${exchange} -> info, error`)
        } catch (e) {
            console.log(TAG, ' -> createQueuesByRouting -> ', e.message)
            throw e
        }
    }

    /**
     * Método para enviar mensajes de información
     *
     * @param message
     */
    static async sendMessageInfo(message) {
        try {
            let opts = {contentType: 'application/json', persistent: true}
            await channel.publish(exchange, 'info', Buffer.from(JSON.stringify(message), 'utf-8'), opts)
            console.log(`Message sent to 'logs.success'.`)
        } catch (e) {
            console.log(TAG, ' -> sendMessageInfo -> ', e.message)
            throw e
        }
    }

    /**
     * Método para enviar mensajes de error
     *
     * @param message
     */
    static async sendMessageError(message) {
        try {
            let opts = {contentType: 'application/json', persistent: true}
            await channel.publish(exchange, 'error', Buffer.from(JSON.stringify(message), 'utf-8'), opts)
            console.log(`Message sent to 'logs.error'.`)
        } catch (e) {
            console.log(TAG, ' -> sendMessageError -> ', e.message)
            throw e
        }
    }
}