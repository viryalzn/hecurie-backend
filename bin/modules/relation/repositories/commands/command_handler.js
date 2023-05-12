const Relation = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const relation = new Relation(db);

const insertRelation = async (payload) => {
    const relation = new Relation(db);
    return relation.insertRelation(payload);
};

const updateRelation = async (payload) => {
    const relation = new Relation(db);
    return relation.updateRelation(payload);
};

const deleteRelation = async (payload) => {
    return relation.deleteRelation(payload);
};

module.exports = {
    insertRelation,
    updateRelation,
    deleteRelation
};
