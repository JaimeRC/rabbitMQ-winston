const {routing} = require('../controllers')

module.exports = async (req, res) => {
    try {

        const {body: {message}} = req

        await routing.sendMessageInfo(message)

        res.send({statusOk: true, results: `Message: ${JSON.stringify(message)} sent to 'logs.info' queue.`})

    } catch (error) {
        console.error(error.message)

        res.status(500).send({statusOk: false, message: error.message})
    }
}