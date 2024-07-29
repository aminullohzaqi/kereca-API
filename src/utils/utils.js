function toLower(string, level) {
    if (typeof string !== 'string') {
        throw new TypeError('string must be a string')
    }

    const lowerCase = string.toLowerCase()

    let result = lowerCase.replace(/\s+/g, '-')

    if (level === 'province' && lowerCase.includes('jakarta')) {
        return result = 'dki-jakarta'
    }

    return result
}

function fixCity(string) {
    if (typeof string !== 'string') {
        throw new TypeError('string must be a string')
    }

    let result = string

    if (string.includes('Kota') || string.includes('Kabupaten')) {
        result = string.replace('Kota ', '').replace('Kabupaten ', '')
    }

    return result
}

function adjustHour(hour, items) {
    hoursList = items.map(item => {
        return item.h
    })

    const hourPred = hoursList.includes(hour) ? hour : hoursList.reduce((prev, curr) => (curr < hour ? curr : prev), hoursList[0])

    const index = items.findIndex(item => item.h === hourPred);

    return index
}

function parseHour(hour) {
    if (hour === null) {
        return (null)
    }
    return parseInt(hour.split(':')[0])
}
function getHour(string) {
    const date = new Date(string)
    const gmtHour = date.getUTCHours() + 7
    return gmtHour
}

function getWeatherDesc(code) {
    code = parseInt(code)
    if (code === 0) {
        return 'Cerah'
    } else if (code === 1 || code === 2) {
        return 'Cerah Berawan'
    } else if (code === 3) {
        return 'Berawan' 
    } else if (code === 4) {
        return 'Berawan Tebal'
    } else if (code === 5) {
        return 'Udara Kabur'
    } else if (code === 10) {
        return 'Asap'
    } else if (code === 45) {
        return 'Kabut'
    } else if (code === 60) {
        return 'Hujan Ringan'
    } else if (code === 61) {
        return 'Hujan Sedang'
    } else if (code === 63) {
        return 'Hujan Lebat'
    } else if (code === 80) {
        return 'Hujan Lokal'
    } else if (code === 95) {
        return 'Hujan Petir'
    } else if (code === 97) {
        return 'Hujan Petir'
    }
}

function getWeatherImage(code) {
    code = parseInt(code)
    if (code === 0) {
        return 'https://openweathermap.org/img/wn/01d@2x.png'
    } else if (code === 1 || code === 2) {
        return 'https://openweathermap.org/img/wn/02d@2x.png'
    } else if (code === 3) {
        return 'https://openweathermap.org/img/wn/03d@2x.png'
    } else if (code === 4) {
        return 'https://openweathermap.org/img/wn/04d@2x.png'
    } else if (code === 5) {
        return 'https://openweathermap.org/img/wn/50d@2x.png'
    } else if (code === 10) {
        return 'https://openweathermap.org/img/wn/50d@2x.png'
    } else if (code === 45) {
        return 'https://openweathermap.org/img/wn/50d@2x.png'
    } else if (code === 60) {
        return 'https://openweathermap.org/img/wn/10d@2x.png'
    } else if (code === 61) {
        return 'https://openweathermap.org/img/wn/10d@2x.png'
    } else if (code === 63) {
        return 'https://openweathermap.org/img/wn/11d@2x.png'
    } else if (code === 80) {
        return 'https://openweathermap.org/img/wn/10d@2x.png'
    } else if (code === 95) {
        return 'https://openweathermap.org/img/wn/11d@2x.png'
    } else if (code === 97) {
        return 'https://openweathermap.org/img/wn/11d@2x.png'
    }
}

module.exports = {toLower, fixCity, adjustHour, parseHour, getHour, getWeatherDesc, getWeatherImage}