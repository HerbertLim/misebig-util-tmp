const _ = require('lodash')
const d3scale = require('d3-scale');
//import * as d3scale from 'd3-scale';

// O3: 8시간 평균이 1~5 단계까지, 1시간 평균은 125ppb 이상일 때 3~6단계까지 존재함
// PM2.5와 PM10은 하루 평균
// CO: 8시간 평균
// SO2: 1~4단계는 1시간 평균, 5~6단계는 24시간 평균
// NO2: 1시간 평균
const std = { // 미세빅 표준
    level: 6,
    color: [ 'green', 'yellow', 'orange', 'red', 'purple', 'maroon', 'grey'],
    name: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous', 'Out of Bounds' ],
    pm25: [ 12, 25.4, 55.4, 150.4, 250.4, 350.4 ],
    //pm25: [ 12.0, 35.4, 55.4, 150.4, 250.4, 350.4 ], // US AQI
    pm10: [ 30, 50, 150, 354, 424, 504 ],
    //pm10: [ 54, 155, 254, 354, 424, 504 ], // US AQI
    no2: [ 0.03, 0.06, 0.2, 0.649, 1.249, 1.649 ],
    o3: [ 0.03, 0.09, 0.15, 0.204, 0.404, 0.504 ],
    so2: [ 0.02, 0.050, 0.15, 0.304, 0.604, 0.804 ],
    co: [ 2, 9.4, 12.4, 15.0, 30.4, 40.4 ],
    indexBp: [ 50, 100, 150, 200, 300, 400 ]
};

// AQI 500 이상일 때
// PM2.5 : y = (99/150)x + 169.736 
// PM10 : y = x - 104
// NO2 : y = (99/0.399)x - 8.3985
// O3 : y = 995x - 101.975
// SO2 : y = (199/0.399)x + 99.01
// CO : y = (199/19.9)x - 4


const pNames = {
    PM25 : 'pm25',
    PM10 : 'pm10',
    O3 : 'o3',      // ppb
    NO2 : 'no2',    // ppb
    CO : 'co',      // ppb
    SO2 : 'so2'     // ppb
};

function concsToAqis (pollutant, concs, aqis) {
    console.log(`>>> ${pollutant} `, concs)
    console.log(`>>> AQIs`, aqis)
}

function concToAqi (pollutant, conc) {
    let aqi;
    const level = getConcLevel(pollutant, conc)
    if (level == 6) {
        aqi = concToAqiLast(pollutant, conc)
        return aqi;
    }

    // level is 0~5
    const bpLow = getAqiLow(pollutant, level)
    const bpHigh = getAqiHigh(pollutant, level)
    const cLow = getCLow(pollutant, level)
    const cHigh = getCHigh(pollutant, level)
    
    aqi = bpLow + (conc - cLow)*(bpHigh - bpLow)/(cHigh - cLow)
    return Math.round(aqi,0);
}

function getPosInLevel (aqi) {
    const hazardousPos = d3scale.scaleLog()
                .domain([301, 500, 2000])
                .range([0, 0.4, 0.45])

    if (aqi > 301) {
        return hazardousPos(aqi)
    }

    const level = getLevelByAqi(aqi)
    const highValue = std.indexBp[level];
    const lowValue = level > 0 ? std.indexBp[level-1] + 1 : 0;
    const pos = (aqi - lowValue)/(highValue - lowValue)
    return pos; 
}

function getLevelByAqi (aqi) {
    if (aqi > 400) return 5;

    let level;
    for (level = 0; level < std.level; level++) {
        if (aqi <= std.indexBp[level]) break;
    }
    return level;
}

module.exports = {
    getLevelByAqi,
    getPosInLevel,
    concToAqi,
    concsToAqis,
}

// 각 오염원에서 AQI가 401 이상이되는 구간 계산
// 농도가 무한히 높아지더라도 401~500 구간의 linear rate로 AQI를 계산함
function concToAqiLast(pollutant, conc) {
    let aqi;
    switch (pollutant) {
        case 'pm25':
            aqi = (99/150)*conc + 169.736;
            break;
        case 'pm10':
            aqi = conc - 104;
            break;
        case 'no2':
            aqi = (99/0.399)*conc - 8.3985
            break;
        case 'o3':
            aqi = 995*conc - 101.975;
            break;
        case 'so2':
            aqi = (199/0.399)*conc + 99.01;
            break;
        case 'co':
            aqi = (199/19.9)*conc - 4;
            break;
        default:
    }
    if (Number(aqi)) return Math.round(aqi, 0)
    else return -1;
}

// 오염원의 농도가 어느 레벨인지 알려줌
// Return: Level: 0 ~ 5/6
function getConcLevel(pollutant, conc) {
    if (!isValidPollutantName(pollutant)) return -1;
    
    let level = -1;
    std[pollutant].map ( (limit, i) => {
        if (conc <= limit && level == -1) {
            //console.log(`>>> ${conc} < ${limit} `)
            level = i;
            //if (level == -1) level = i;
            //return i; // return previous i as level
        }
    })
    if (level == -1) return 6;
    else return level;
}

function getAqiLow(pollutant, level) {
    if (level == -1) return -1;
    if (level == 0) return 0;
    return std.indexBp[level-1] + 1;
}

function getAqiHigh(pollutant, level) {
    if (level == -1) return -1;
    return std.indexBp[level]
}

function getCLow(pollutant, level) {
    if (level == -1) return -1;
    if (level == 0) return 0;
    // level > 0
    let lowValue = std[pollutant][level-1];
    switch (pollutant) {
        case 'pm25':
            lowValue += 0.1;
            break;
        case 'pm10':
            lowValue += 1;
            break;
        case 'co':
            lowValue += 0.01;
            break;
        default: // NO2, SO2, O3
            lowValue += 0.001;
    }
    return lowValue;
}

function getCHigh(pollutant, level) {
    if (level == -1) return -1;        
    return std[pollutant][level];
}


function isValidPollutantName(pollutant) {
    return _.includes(pNames, pollutant)
}

function isValidConcValue(conc) {
    if (conc < 0 || conc == null || conc == '-') return false;
    else return true;
}

function getAqiLevel(pollutant, aqi) {
    if (!isValidAqi(aqi)) return -1;
    
    let level = -1;
    let i = 0;
    for (i = 0; i < 6; i++) {
        if (aqi <= aqiStd.indexBp[i]) {
            level = i;
            break;
        }
    }
    if (i == 6) {
        if (plt == pollutant.PM10) level = 6;
        else level = 5;
    }
    return level;
}


function isValidAqi(aqi) {
    // Valid AQI value range is 0~500.
    //if (aqi < 0 || aqi > 501) return false;
    if (Number(aqi) < 0 ) return false;
    else return true;
}  