const Illness = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const illness = new Illness(db);

const insertIllness = async (payload) => {
    const illness = new Illness(db);
    return illness.insertIllness(payload);
};

const updateIllness = async (payload) => {
    const illness = new Illness(db);
    return illness.updateIllness(payload);
};

const deleteIllness = async (payload) => {
    return illness.deleteIllness(payload);
};

module.exports = {
    insertIllness,
    updateIllness,
    deleteIllness
};
