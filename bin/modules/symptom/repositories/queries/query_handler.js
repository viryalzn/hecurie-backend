const Symptom = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const symptom = new Symptom(db);

const listSymptom = async (payload) => {
    return symptom.listSymptom(payload);
};

const getSymptom = async (payload) => {
    return symptom.getSymptom(payload);
};

module.exports = {
    listSymptom,
    getSymptom
};
