const User = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const user = new User(db);

const listUser = async (payload) => {
    return user.listUser(payload);
};

const getUser = async (payload) => {
    return user.getUser(payload);
};

module.exports = {
    listUser,
    getUser
};
