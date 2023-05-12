const Illness = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const illness = new Illness(db);

const listIllness = async (payload) => {
    return illness.listIllness(payload);
};

const getIllness = async (payload) => {
    return illness.getIllness(payload);
};

module.exports = {
    listIllness,
    getIllness
};
