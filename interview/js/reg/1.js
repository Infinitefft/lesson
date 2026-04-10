// 11 位
// 1 开头 + 10 位数字
// 用户输入的字符串
// 一定的模式
const phone = '12345678901'
const reg = /^1\d{10}$/;  // 正则对象

console.log(reg.test(phone));