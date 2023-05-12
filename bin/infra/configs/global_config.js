require('dotenv').config();
const confidence = require('confidence');

const config = {
    port: process.env.PORT,
    defaultPassword: process.env.DEFAULT_PASSWORD,
    secretKeyCrypto: process.env.SECRET_KEY_CRYPTO,
    secretKeyCryptoJs: process.env.SECRET_KEY_CRYPTOJS,
    serviceName: process.env.SERVICE_NAME,
    env: process.env.NODE_ENV,
    apmService: process.env.APM_SERVICE,
    ddAgentHost: process.env.DD_AGENT_HOST,
    jwt: {
        defaultExpiresIn: process.env.JWT_DEFAULT_EXPIRES_IN,
    },
    basicAuthApi: [
        {
            username: process.env.BASIC_AUTH_USERNAME,
            password: process.env.BASIC_AUTH_PASSWORD
        }
    ],
    publicKey: process.env.PUBLIC_KEY_PATH,
    privateKey: process.env.PRIVATE_KEY_PATH,
    mongoDbUrl: process.env.MONGO_DATABASE_URL
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
