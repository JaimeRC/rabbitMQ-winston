const TAG = '[CONSUMER] -> Action -> '

module.exports = (queue, id, data) => {
    const {Job} = require('../consumers')

    setTimeout(() => {
        console.log(TAG, queue,id,data.toString())
        Job.sendResultsToService(queue, id, data)
    },3000)
}