const Symptom = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const symptom = new Symptom(db);

const insertSymptom = async (payload) => {
    const symptom = new Symptom(db);
    return symptom.insertSymptom(payload);
};

const updateSymptom = async (payload) => {
    const symptom = new Symptom(db);
    return symptom.updateSymptom(payload);
};

const deleteSymptom = async (payload) => {
    return symptom.deleteSymptom(payload);
};

module.exports = {
    insertSymptom,
    updateSymptom,
    deleteSymptom
};
