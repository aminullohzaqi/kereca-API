const routes = (handler) => [
    {
        method: 'GET',
        path: '/route-weather/{idkereta}',
        handler: handler.getRouteWeatherHandler
    }
];

module.exports = routes