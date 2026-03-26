// 生成器函数
function *fruitGenerator() {
  console.log("开始生产水果");
  yield "苹果";
  console.log("生产了苹果，继续生产");
  yield "香蕉";
  console.log("生产了香蕉，生产结束");
  return "没有水果了";
}

// 拿到生成器对象 迭代器
const fruitMachine = fruitGenerator();
fruitMachine.next();
console.log(fruitMachine.next());
console.log(fruitMachine.next());
console.log(fruitMachine.next());
fruitMachine.next();
fruitMachine.next();