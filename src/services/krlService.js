const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const ClientError = require('../exceptions/ClientError');
const axios = require('axios');
const { toLower, fixCity, adjustHour } = require('../utils/utils');
 
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
                try {
                    let reverseGeocodeResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=id`)
                    let adminLevels = reverseGeocodeResponse.data.localityInfo.administrative.filter(item => item.adminLevel >= 4 && item.adminLevel <= 6)
                    responseRoute[i].province = (adminLevels.find(level => level.adminLevel === 4) || { name: '-'}).name
                    responseRoute[i].city = (adminLevels.find(level => level.adminLevel === 5) || { name: '-'}).name
                } catch (error) {
                    console.log(error)
                }
            }

            const promisesWeather = responseRoute.map(station => {
                if (station.city === '-') {
                    return '-'
                }
                const province = toLower(station.province, 'province')
                return axios.get(`https://cuaca-gempa-rest-api.vercel.app/weather/${province}`)
            })

            const responseWeather = await Promise.all(promisesWeather)

            for (let i = 0; i < responseRoute.length; i++) {
                let hour = responseRoute[i].time_est
                hour = parseInt(hour.split(':')[0]);
                const city = fixCity(responseRoute[i].city)
                const weatherArea = responseWeather[i].data.data.areas.find(area => area.description.includes(city)) || '-'
                if (weatherArea === '-') {
                    responseRoute[i].weather = '-'
                    continue
                }
                const index = adjustHour(hour, weatherArea.params.find(param => param.id === 'weather').times)
                responseRoute[i].temperature = weatherArea.params.find(param => param.id === 't').times[index].celcius
                responseRoute[i].humidity = weatherArea.params.find(param => param.id === 'hu').times[index].value
                responseRoute[i].weather = weatherArea.params.find(param => param.id === 'weather').times[index].name
                responseRoute[i].weatherCode = weatherArea.params.find(param => param.id === 'weather').times[index].code
            }
    
            return responseRoute
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = KrlService