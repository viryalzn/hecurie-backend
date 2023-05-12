const config = require('../../../infra/configs/global_config');
const monitoring = parseInt(config.get('/monitoring'));
//add more logic if there is another service
let apm;
if (monitoring == 1) {
    apm = require('../dd-trace/apm');
} else if (monitoring == 2){
    apm = require('../es-apm/apm');
} else {
    apm = { init: () => false };
}

module.exports = apm;
