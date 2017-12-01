const log4js = require('log4js');

log4js.configure({

    appenders: {
        logfaces: {type: 'logFaces-HTTP', url: 'http://45.77.55.123:9700'},
        fileAll: {type: 'file', filename: '/var/log/logsAll.log'},
        console: {type: 'console'},
        fileInfo: {type: 'file', filename: '/var/log/logsInfo.log'},
        fileError: {type: 'file', filename: '/var/log/logsError.log'},
        fileDebug: {type: 'file', filename: '/var/log/logsDebug.log'},
    },
    categories: {
        default: {appenders: ['fileAll', 'console'], level: 'all'},
        fileInfo: {appenders: ['fileInfo'], level: 'info'},
        fileError: {appenders: ['fileError'], level: 'error'},
        fileDebug: {appenders: ['fileDebug'], level: 'debug'},
        logfaces: {appenders: ['logfaces'], level: 'debug'}
    }
});

module.exports =
    {
        fileError: log4js.getLogger('fileError'),
        fileDebug: log4js.getLogger('fileDebug'),
        fileAll: log4js.getLogger('default'),
        fileInfo: log4js.getLogger('fileInfo'),
        logfaces: log4js.getLogger('logfaces')

    }





