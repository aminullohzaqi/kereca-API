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

module.exports = {toLower, fixCity, adjustHour}