# Misebig Util
미세빅에서 공통적으로 많이 사용되는 유틸리티

설치 및 사용

```
$ npm i -S https://github.com/HerbertLim/misebig-util.git

import {dateToUserFriendly} from 'misebig-util';
```

# 시간 변환
## `getKstLambdaDate()`
AWS Lambda 함수의 타임은 UTC이다. Lambda 함수에서 한국 시간 KST을 리턴한다. AWS Lambda에서는 `new Date()`가 아닌 이 함수를 이용해야 한다.

## `toEcoaTime(date)`
Javascript Date를 ecoaTime 문자열 형식으로 변환한다. 

- date: Javascript Date object

## `dateToUserFriendly(date, type)`
Javascript Date를 읽기 좋은 문자열 형태로 변환한다. type 에 따라 다음과 같은 문자열을 리턴한다

- 1: 분을 항상 00 으로 함
  - `4/23(월) 19:00`   
- 2: 분까지 표시함
  - `4/23(월) 19:23`
- 3: 시간까지만 표시함
  - `4/23(월) 19시`
- 4: 발표와 측정 시간을 모두 표시
  - `4/23(월) 19시 발표(18시 측정) 기준`
- 5: 날짜와 요일만
  - `2019년 4/23(월)`
- 6: 날짜, 요일에 24시간 형식의 시간, 그리고 '발표' 시간임을 명시
  - `2019년 4/23(월) 17시 발표`
- 7: 날짜와 시간:분, 단 분은 항상 00 으로 표시함
  - `2019.4.23(월) 07:00`
- 8: 타입 7에서 요일을 영문으로 표시
  - `2019.4.23(Mon) 07:00`
- 9: UTC Time으로 표시
  - `2019.4.23(Mon) 08:00`
- 10: 시간:분 표시. 단 분은 항상 00.
  - `19:00`

## `ecoaTimeToJsDate(ecoaTime)`
ecoaTime 문자열 형식 시간을 Javascript Date 객체로 변환한다.

- 24시인 경우 23시 기준 JS Date를 구한 후 다시 1시간을 더하여 JS Date를 만든다
  - 실제 시간이 2018년 1월 1일 0시일 때, EcoaTime은 2017123124 로 표현된다

# 미세빅 AQI 변환
Deprecated. Use [`air-conc-aqi-converter`](https://github.com/HerbertLim/air-conc-aqi-converter.git)

## `concToAqi (pollutant, conc)`
오염원의 농도를 미세빅 AQI로 변환

- pollutant: 'pm25', 'pm10', 'no2', 'o3', 'co', 'so2'
- conc: Number

## `getPosInLevel (aqi)`
AQI를 소수점 형태의 등급으로 변환하여 리턴함. AQI 지수가 등급에서 어느 정도 위치에 해당하는지 알기 위해 사용함.

## `getLevelByAqi (aqi)`
AQI를 정수 등급으로 변환하여 리턴함.

