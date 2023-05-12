const Mongo = require('mongodb').MongoClient;
const config = require('../../../infra/configs/global_config');
const wrapper = require('../../utils/wrapper');

let mongoConnection;

const init = async () => {
    mongoConnection = await Mongo.connect(config.get('/mongoDbUrl'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

const getConnection = async () => {
    mongoConnection = await Mongo.connect(config.get('/mongoDbUrl'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return new Promise((resolve, reject) => resolve(wrapper.data({db: mongoConnection})));
};

module.exports = {
    init,
    getConnection
};
