// 观察者模式是经典的设计模式
import {
  Observable,
} from 'rxjs';

// 创建了一个Observable 对象
// 参数是一个回调函数，
// subscriber 观察者对象
const stream = new Observable((subscriber) => {
  // next 发送数据
  // complete 完成数据流
  subscriber.next('hello');
  subscriber.next('world');
  subscriber.complete();
});

// 订阅数据流
stream.subscribe((value) => {
  console.log(value);
})