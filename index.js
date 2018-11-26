const t = require('./src/lib/time')
const aqiCalc = require('./src/lib/aqiCalc')

module.exports = {
    ...t,
    ...aqiCalc,
}