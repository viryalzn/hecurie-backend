const Diagnosis = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const diagnosis = new Diagnosis(db);

const listDiagnosis = async (payload) => {
    return diagnosis.listDiagnosis(payload);
};

const getDiagnosis = async (payload) => {
    return diagnosis.getDiagnosis(payload);
};

module.exports = {
    listDiagnosis,
    getDiagnosis
};
