const m = require('../index')

const now = new Date();
console.log(m.toEcoaTime(now))

console.log(m.getLevelByAqi(56))