const configs = require('./bin/infra/configs/global_config');
const express = require('express')
const app = express()
const port = process.env.port || configs.get('/port') || 9023;
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const apm = require('./bin/helpers/components/monitoring/observability');
apm.init();

const logger = require('./bin/helpers/utils/logger');
const AppServer = require('./bin/app/server');
const appServer = new AppServer();
const ctx = 'App-Server';

appServer.server.listen(port, () => {
    logger.enableLogging();
    logger.log(ctx, `${appServer.server.name} started, listening at ${appServer.server.url}`, 'App.Listen');
});
