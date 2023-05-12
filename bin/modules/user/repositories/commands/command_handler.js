const User = require('./domain');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const user = new User(db);

const registerUser = async (payload) => {
    const user = new User(db);
    return user.registerUser(payload);
};

const login = async (payload) => {
    const user = new User(db);
    return user.login(payload);
};

const updateUser = async (payload) => {
    const user = new User(db);
    return user.updateUser(payload);
};

const changePassword = async (payload) => {
    const user = new User(db);
    return user.changePassword(payload);
};

const deleteUser = async (payload) => {
    return user.deleteUser(payload);
};

module.exports = {
    registerUser,
    login,
    updateUser,
    changePassword,
    deleteUser
};
