const config = require('../infra/configs/global_config');
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware2');
const project = require('../../package.json');
const mongoConnectionPooling = require('../helpers/databases/mongodb/connection');
const illnessHandler = require('../modules/illness/handlers/api_handler');
const symptomHandler = require('../modules/symptom/handlers/api_handler');
const diagnosisHandler = require('../modules/diagnosis/handlers/api_handler');
const relationHandler = require('../modules/relation/handlers/api_handler');
const userHandler = require('../modules/user/handlers/api_handler');

function AppServer() {
    this.server = restify.createServer({
        name: `${project.name}-server`,
        version: project.version
    });

    this.server.serverKey = '';
    this.server.use(restify.plugins.acceptParser(this.server.acceptable));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());
    this.server.use(restify.plugins.authorizationParser());

    // required for CORS configuration
    const corsConfig = corsMiddleware({
        preflightMaxAge: 5,
        origins: ['*'],
        // ['*'] -> to expose all header, any type header will be allow to access
        // X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
        allowHeaders: ['Authorization'],
        exposeHeaders: ['Authorization']
    });
    this.server.pre(corsConfig.preflight);
    this.server.use(corsConfig.actual);

    this.server.post('/illness', illnessHandler.insertIllness);
    this.server.put('/illness/:illnessId', illnessHandler.updateIllness);
    this.server.get('/getIllness/:illnessId', illnessHandler.getIllness);
    this.server.get('/getIllness', illnessHandler.listIllness);
    this.server.del('/illness/:illnessId', illnessHandler.deleteIllness);

    this.server.post('/symptom', symptomHandler.insertSymptom);
    this.server.put('/symptom/:symptomId', symptomHandler.updateSymptom);
    this.server.get('/getSymptom/:symptomId', symptomHandler.getSymptom);
    this.server.get('/getSymptom', symptomHandler.listSymptom);
    this.server.del('/symptom/:symptomId', symptomHandler.deleteSymptom);

    this.server.post('/diagnosis', diagnosisHandler.insertDiagnosis);
    this.server.get('/getDiagnosis/:patientId', diagnosisHandler.getDiagnosis);
    this.server.get('/getDiagnosis', diagnosisHandler.listDiagnosis);

    this.server.post('/relation', relationHandler.insertRelation);
    this.server.put('/relation/:relationId', relationHandler.updateRelation);
    this.server.get('/getRelation/:relationId', relationHandler.getRelation);
    this.server.get('/getRelation', relationHandler.listRelation);
    this.server.del('/relation/:relationId', relationHandler.deleteRelation);

    this.server.post('/user', userHandler.registerUser);
    this.server.post('/user/login', userHandler.login);
    this.server.put('/user/:userId', userHandler.updateUser);
    this.server.put('/user/password/:userId', userHandler.changePassword);
    this.server.get('/getUser/:userId', userHandler.getUser);
    this.server.get('/getUser', userHandler.listUser);
    this.server.del('/user/:userId', userHandler.deleteUser);
}

module.exports = AppServer;
