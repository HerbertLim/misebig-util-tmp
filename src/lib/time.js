
// This function has bugs. Use toEcoaTime(). 2018.1.15
function getEcoaTime(date) {
    const ecoaTime = '' + date.getFullYear() + 
        ( date.getMonth()+1 < 10 ? '0' + date.getMonth()+1 : date.getMonth()+1 ) +
        ( date.getDate() < 10 ? '0' + date.getDate() : date.getDate() ) +  
        ( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ) + '00';
        
    return ecoaTime;
}


// 0시는 전날 24시로 변경한다. 
// 예) 2일 0시는 1일 24시이다. 따라서, 2017010020000 은 201710012400 이 되도록 한다.
function getEcoaTime2(dateTime) {
    const month = dateTime.getMonth() + 1;
    let hour = dateTime.getHours();
    let date = dateTime.getDate();
    date = hour === 0 ? date-1 : date;
    hour = hour === 0 ? 24 : hour;

    console.log(`getEcoaTime2: original Hour=${dateTime.getHours()}, new ${month}.${date}. ${hour}:00`);

    console.log(dateTime.getMonth()+1 < 10 ? '0' + dateTime.getMonth()+1 : dateTime.getMonth()+1)
    console.log(month < 10 ? '0' + month : month)
    const ecoaTime = '' + dateTime.getFullYear() + 
        ( month < 10 ? '0' + month : month ) +
        ( date < 10 ? '0' + date : date ) +  
        ( hour < 10 ? '0' + hour : hour) + '00';
        
    console.log(ecoaTime);
    
    return ecoaTime;
}

function toEcoaTime(t) {
    //console.log(`    toEcoaTime(${t})`);
    
    const date = new Date(t);
    //console.log(`      ${date.toLocaleString()}`);
    
    //console.log(`toEcoaTime: date.getHours():`,date.getHours())
    let dateDecr = null;
    if (date.getHours() == 0) {
        dateDecr = new Date(date.getTime() - 24*3600*1000);
    } else {
        dateDecr = date;
    }

    let month = '';
    if (dateDecr.getMonth() < 9) {
        month = '0' + (dateDecr.getMonth() + 1);
    } else {
        month = '' + (dateDecr.getMonth() + 1);
    }

    let dateStr = '';
    if (dateDecr.getDate() < 10) {
        dateStr = '0' + dateDecr.getDate();
    } else {
        dateStr = '' + dateDecr.getDate();
    }

    let hoursStr = '';
    if (date.getHours() == 0) { 
        hoursStr = '24';
    } else if (date.getHours() < 10) {
        hoursStr = '0' + date.getHours();
    } else {
        hoursStr = '' + date.getHours();
    }

    return dateDecr.getFullYear()+ '' + month + dateStr + hoursStr + '00';
}

function getKstLambdaDate() {
    const utcTime = new Date() // In Lambda, time is UTC unlike EC2 instance
    const kstTime = new Date(utcTime.getTime() + 9*60*60*1000)
    return kstTime;
}

// convert ecoaTime to standard JS Date object
// 24시인 경우 23시 기준 JS Date를 구한 후 다시 1시간을 더하여 JS Date를 만든다
// 실제 시간이 2018년 1월 1일 0시일 때, EcoaTime은 2017123124 로 표현된다
function ecoaTimeToJsDate(time) {
    if (time == 0) {
        // time is 0 when misebig failed to connect to internet
        // just return current time
        const now = new Date()
        return new Date(
            now.getFullYear(), 
            now.getMonth(),
            now.getDate(),
            now.getHours()
        )
    }

    const hour = time.substr(8,2)
    let now = null;

    if (hour === '24') {
        //console.log(`hour is 24`)
        now = new Date(time.substr(0, 4),   // Year
                    time.substr(4, 2)-1,    // Month
                    time.substr(6, 2),      // Date
                    '23',                   // Hour
                    time.substr(10, 2))
        now = new Date(now.getTime() + 3600*1000)
    } else {
        //console.log(`hour is not 24`)
        now = new Date(time.substr(0, 4), 
                    time.substr(4, 2)-1,
                    time.substr(6, 2),
                    time.substr(8, 2),
                    time.substr(10, 2))
    }

    return now;
}

// Type 1: 4/23(월) 19:00 에서 분을 항상 00 으로 함
// Type 2: 4/23(월) 19:23 분까지 표시함
// Type 3: 4/23(월) 19시 로 시간까지만 표시함
// Type 4: 4/23(월) 19시 발표(18시 측정) 기준
function dateToUserFriendly(date, type) {
    const krDays = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];

    //console.log(`time.dateToUserFriendly(): date: `, date.toString())

    let timeStr = (date.getMonth() + 1) + '/' + date.getDate() + 
                krDays[date.getDay()] + ' ' +
                date.getHours() ; 
        
    const min = date.getMinutes()

    switch (type) {
    case 1:
        timeStr += ':00'
        break;
    case 2:
        timeStr += ':' + (min < 10 ? '0' + min : min)
        break;
    case 3:
        timeStr += '시'
        break;
    case 4:
        const measureTime = new Date(date.getTime() - 1000*3600)
        const hour = measureTime.getHours()
        timeStr += '시 발표 기준 (' + hour + '시 측정)';
        break;
    default:

    }
                
    return timeStr;
}

module.exports = {
    getEcoaTime,
    getEcoaTime2,
    toEcoaTime,
    getKstLambdaDate,
    dateToUserFriendly,
    ecoaTimeToJsDate,
}