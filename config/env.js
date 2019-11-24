const yargs = require('yargs')

let path = __dirname.split('/')
path.splice(path.length - 1, 1)
path = path.join('/')

module.exports = {

    getArgvs() {
        return yargs
            .usage('Usage: node $0 [options]')
            .example('node $0 -ne local_level -p 4000 -ps /logs/logsSuccess.log -pe /logs/logsError.log -ur amqp://guest:guest@10.100.2.99:5672 -qi logsSuccess -qe logsError')
            .option('NODE_ENV', {
                alias: 'ne',
                describe: 'Write an environment for the process',
                type: String,
                choices: ['local', 'local_devel', 'dev', 'master'],
                default: 'local_devel'
            })
            .option('PORT', {
                alias: 'p',
                describe: 'Write a Port by Express',
                type: Number,
                default: 4000
            })
            .option('PATH_LOGS_SUCCESS', {
                alias: 'ps',
                describe: 'Write a path to the info log',
                type: String,
                default: `${path}/logs/logsSuccess.log`
            })
            .option('PATH_LOGS_ERROR', {
                alias: 'pe',
                describe: 'Write a path to the error log',
                type: String,
                default: `${path}/logs/logsError.log`
            })
            .option('URL_RABBIT', {
                alias: 'ur',
                describe: 'Write a Host by RabbitMQ with port',
                type: String,
                default: 'amqp://guest:guest@10.100.2.99:5672'
            })
            .option('QUEUE_SUCCESS', {
                alias: 'qi',
                describe: 'Write a queue to connect a RabbitMQ - Info Logs',
                type: String,
                default: 'logsSuccess'
            })
            .option('QUEUE_ERROR', {
                alias: 'qe',
                describe: 'Write a queue to connect a RabbitMQ - Error Logs',
                type: String,
                default: 'logsError'
            })
            .demandOption(['NODE_ENV', 'PORT', 'URL_RABBIT', 'QUEUE_SUCCESS', 'QUEUE_ERROR'],
                'Please provide both environment, port, urlRabbit, queueSuccess and queueError arguments to work with this tool ')
            .help('h')
            .argv
    }
}