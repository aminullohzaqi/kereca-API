const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');
const axios = require('axios');
const { toLower, fixCity, adjustHour, parseHour, getHour, getWeatherDesc, getWeatherImage } = require('../utils/utils');
 
class KrlService {
    constructor() {
    }

    async getRouteWeather(idkereta) {
        const payload = {
            train_no: idkereta
        }

        try {
            let responseRoute = await axios.post(`https://access.kci.id/api/v1/train/realtime-train`, payload)
            responseRoute = responseRoute.data.data
            const station_id = responseRoute.map(station => station.station_id)
                
            const promisesStationId = station_id.map(station => {
                return axios.post(`https://access.kci.id/api/v1/train/stations/search`, {
                    station: station
                })
            })
            
            const responseStationId = await Promise.all(promisesStationId)
            
            for (let i = 0; i < responseStationId.length; i++) {
                let lat = responseStationId[i].data.data[0].lat
                let long = responseStationId[i].data.data[0].long
                responseRoute[i].lat = lat
                responseRoute[i].long = long
            }

            const nowHour = parseInt(new Date().getHours())
            const firstHour = parseHour(responseRoute[0].time_est)

            if (firstHour !== null) {
                const promisesPresentWeather = responseRoute.filter(station => parseHour(station.time_est) === firstHour || parseHour(station.time_est) < nowHour).map(station => {
                    const lat = station.lat
                    const long = station.long
                    return axios.get(`https://weather.bmkg.go.id/api/amandemen/analyze?lon=${long}&lat=${lat}`)
                })
    
                const responsePresentWeather = await Promise.all(promisesPresentWeather)
    
                const promisesFutureWeather = responseRoute.filter(station => parseHour(station.time_est) > firstHour).map(station => {
                    const lat = station.lat
                    const long = station.long
                    return axios.get(`https://cuaca.bmkg.go.id/api/df/v1/forecast/coord?lon=${long}&lat=${lat}`)
                })
    
                const responseFutureWeather = await Promise.all(promisesFutureWeather)
    
                for (let i = 0; i < responseRoute.length; i++) {
                    if (i < responsePresentWeather.length) {
                        responseRoute[i].weather_code = responsePresentWeather[i].data[0].weather
                        responseRoute[i].weather_desc = getWeatherDesc(responsePresentWeather[i].data[0].weather)
                        responseRoute[i].temperature = responsePresentWeather[i].data[0].temp
                        responseRoute[i].humidity = responsePresentWeather[i].data[0].rh
                        responseRoute[i].prediction_time = responsePresentWeather[i].data[0].date
                        responseRoute[i].image = getWeatherImage(responsePresentWeather[i].data[0].weather)
                    } else {
                        let hour = parseHour(responseRoute[i].time_est)
                        let weatherData = responseFutureWeather[i - responsePresentWeather.length].data.data[0].cuaca[0].find(data => getHour(data.datetime) === hour)
                        if (weatherData === undefined) {
                            responseRoute[i].weatherCode = '-'
                            continue
                        }
                        responseRoute[i].weather_code = weatherData.weather
                        responseRoute[i].weather_desc = weatherData.weather_desc
                        responseRoute[i].temperature = weatherData.t
                        responseRoute[i].humidity = weatherData.hu
                        responseRoute[i].prediction_time = weatherData.datetime
                        responseRoute[i].image = getWeatherImage(weatherData.weather)
                    }
                }
            }
    
            return responseRoute
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = KrlService