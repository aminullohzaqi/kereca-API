require('dotenv').config();
const Hapi = require('@hapi/hapi');

const krl = require('./api/index')
const KrlService = require('./services/krlService')
 
const init = async () => {
    const krlService = new KrlService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register([
        {
            plugin: krl,
            options: {
                service: krlService
            }
        }
    ])
 
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();