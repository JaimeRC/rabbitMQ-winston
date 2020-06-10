const winston = require('winston')
const {env: {PATH_LOGS_SUCCESS, PATH_LOGS_ERROR}} = process

/**
 * Modulo para crear logs tanto de 'informacion' como de 'errores' en archivos diferentes.
 *
 * Ejemplo de como se guardan los logs:
 *
 *          Tipo    T.Actual    Estado    T.Proceso  T.Transporte         Maquina                        IdProceso                Peticion         Mensaje
 * @example info    12:37:17     [OK]         49           1         jaime-desarrollo     bbbf67b5-df7d-4f01-aa20-a6e317748ecb     logs.success
 * @example error   12:37:17     [KO]         49           1         jaime-desarrollo     bbbf67b5-df7d-4f01-aa20-a6e317748ecb     logs.error
 * @example warn    12:37:17     [TIMEOUT]    49           1         jaime-desarrollo     bbbf67b5-df7d-4f01-aa20-a6e317748ecb     logs.timeout
 *
 */

module.exports = (() => {

        let loggerInfo, loggerError;

        const {
            format: {
                combine, //Metodo para combinar diferentes propiedades
                timestamp, //Para mostrar el tiempo
                printf, //Para mostrar el mensaje en un formato personalizado
            }
        } = winston;

        /**
         * Formato del mensaje a mostrar en los logs (printf)
         */
        const msgFormat = combine(
            timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),//Formato de la fecha en los logs
            printf(info => {
                let error = ""
                if (info.message.error)
                    error = info.message.error

                return (`${info.level} | ${info.timestamp} | ${info.message.status} | ${info.message.timeProcess} | ${info.message.timeTransport} | ${info.message.machine} | ${info.message.id} | ${info.message.petition} | ${info.message.proveedor ? info.message.proveedor : ''}${error ? ' | ' + error : ''}`)

            })
        )

        const transportFileInfo = new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: PATH_LOGS_SUCCESS,
            json: false
        });

        const transportFileError = new winston.transports.File({
            name: 'error-file',
            level: 'error',
            filename: PATH_LOGS_ERROR ,
            json: false
        });

        /**
         * Metodo para devolver la Instancia de modulo de Winston con la configuracion personalizada
         */
        let getWinstonInfo = function () {

            process.removeAllListeners('uncaughtException', function () {
            });

            return winston.createLogger({
                format: msgFormat,
                transports: [
                    transportFileInfo,
                ],
                exceptionHandlers: [
                    transportFileError
                ],
                exitOnError: false
            })
        }

        let getWinstonError = function () {

            process.removeAllListeners('uncaughtException', function () {
            });

            return winston.createLogger({
                format: msgFormat,
                transports: [
                    transportFileError
                ],
                exceptionHandlers: [
                    transportFileError
                ],
                exitOnError: true
            })
        }


        /**
         * Metodo para registrar el mensage y la informacion adicional a los logs
         *
         * @param {String} status           Estado de la peticion (OK,KO,TIMEOUT)
         * @param {Number} entryTime        El tiempo de entrada de la peticion
         * @param {Number} timeProcess      El tiempo de salida del programa que realiza la peticion
         * @param {String} machine          El nombre de la maquina que realiza la consulta
         * @param {String} id               El id de la peticion (externa)
         * @param {String} petition         El tipo de peticion que se ha solicitado
         * @param {String} error            El mensage de error si se ha producido.
         */

        return {
            consumeLogInfo: function (message) {
                console.log(message)
                if (!loggerInfo) loggerInfo = getWinstonInfo();
                loggerInfo.info(message);
            },
            consumeLogError: function (message) {
                if (!loggerError) loggerError = getWinstonError();
                loggerError.error(message);
            }
        }
    }
)()
