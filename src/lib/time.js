
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

module.exports = {
    getEcoaTime,
    getEcoaTime2,
    toEcoaTime,
    getKstLambdaDate
}