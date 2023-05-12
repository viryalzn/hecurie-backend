const configs = require('./bin/infra/configs/global_config');
const express = require('express')
const app = express()
const port = process.env.port || configs.get('/port') || 9023;
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
const illnessHandler = require('./bin/modules/illness/handlers/api_handler');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
//
// app.listen(port, () => {
//     console.log(`app running at http://localhost:${port}`)
// })

const apm = require('./bin/helpers/components/monitoring/observability');
apm.init();

const logger = require('./bin/helpers/utils/logger');
const AppServer = require('./bin/app/server');
const appServer = new AppServer();
const ctx = 'App-Server';

//import route posts
// const postsRouter = require('./routes/posts');
// appServer.server.use('/', illnessHandler); // use route posts di Express

appServer.server.listen(port, () => {
    logger.enableLogging();
    logger.log(ctx, `${appServer.server.name} started, listening at ${appServer.server.url}`, 'App.Listen');
});
