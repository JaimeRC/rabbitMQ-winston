const {RabbitMQ} = require('../controllers')

module.exports = async (req, res) => {
    try {
        const {body: {queue, message}} = req

        await RabbitMQ.sendMessage(queue, message)

        res.send({statusOk: true, results: `Message sent to ${queue} queue.`})

    } catch (error) {
        console.error(error.message)

        res.status(500).send({statusOk: false, message: error.message})
    }
}