const Diagnosis = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const diagnosis = new Diagnosis(db);

const insertDiagnosis = async (payload) => {
    const diagnosis = new Diagnosis(db);
    return diagnosis.insertDiagnosis(payload);
};

const updateDiagnosis = async (payload) => {
    const diagnosis = new Diagnosis(db);
    return diagnosis.updateDiagnosis(payload);
};

const deleteDiagnosis= async (payload) => {
    return diagnosis.deleteDiagnosis(payload);
};

module.exports = {
    insertDiagnosis,
    updateDiagnosis,
    deleteDiagnosis
};
