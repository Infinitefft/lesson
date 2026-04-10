const str = '价格是100元';
// + 匹配一次或多次
const reg = /(\d+)/g;
const res = str.match(/\d+/);
console.log(res[0]);