const tracer = require('dd-trace');
const config = require('../../../infra/configs/global_config');
const project = require('../../../../package.json');

const init = () => {
    tracer.init({
        env: config.get('/ddTrace/env'),
        hostname: config.get('/ddTrace/host'),
        startupLogs: true,
        service: project.name
    });
};

module.exports = {
    init
};
