const Relation = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const relation = new Relation(db);

const listRelation = async (payload) => {
    return relation.listRelation(payload);
};

const getRelation = async (payload) => {
    return relation.getRelation(payload);
};

module.exports = {
    listRelation,
    getRelation
};
