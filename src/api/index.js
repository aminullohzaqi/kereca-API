const KrlHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'krl',
    version: '1.0.0',
    register: async (server, { service }) => {
        const krlHandler = new KrlHandler(service);
        server.route(routes(krlHandler));
    }
}