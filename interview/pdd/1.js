// xxx@xxx.xxx
// const reg = /.+@.+\..+/;  // 正则对象
// . 模糊匹配，匹配任何字符
// + 匹配一次或多次
// @ 精确匹配
// . 精确匹配  本来有工作，任何一个字符，匹配本身的 转义


const reg = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)@[a-zA-Z0-9]+([-a-zA-Z0-9]+)\.[a-zA-Z]{2}$/
console.log(reg.test('abc@qq.com'));