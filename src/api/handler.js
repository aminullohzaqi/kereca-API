const ClientError = require("../exceptions/ClientError")

class KrlHandler {
    constructor(service) {
        this._service = service
        this.getRouteWeatherHandler = this.getRouteWeatherHandler.bind(this)
    }

    async getRouteWeatherHandler(request, h) {
        try {
            const { idkereta } = request.params
            const routeWeather = await this._service.getRouteWeather(idkereta)

            const response = h.response({
                status: 'success',
                data: {
                    routeWeather
                }
            })
            return response

        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                
                response.code(error.statusCode)
                return response
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })

            response.code(500)
            console.error(error)
            return response
        }
    }
}

module.exports = KrlHandler
