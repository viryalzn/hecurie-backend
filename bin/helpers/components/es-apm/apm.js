const apm = require('elastic-apm-node');
const config = require('../../../infra/configs/global_config');

const init = () => {
    if (config.get('/apm/serviceName') === '') {
        return;
    }

    apm.start({
        serviceName: config.get('/apm/serviceName'),
        secretToken: config.get('/apm/secretToken'),
        serverUrl: config.get('/apm/serverUrl'),
        captureExceptions: true,
        logUncaughtExceptions: true
    });
};

module.exports = {
    init
};
