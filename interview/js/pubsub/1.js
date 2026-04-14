// 手写订阅发布这
// 手写自定义事件
// 事件中心
class EventEmitter {
    constructor() {
        // this.listeners = [];
        // key1 = [];
        // key2 = [];
        // dom addEventListener click mouseover
        // {} 各种事件的订阅
        this.events = {};   // 事件池子
    }
    // 订阅关系
    on(event, fn) {
        // 这个频道还没有订阅者
        if (!this.events[event]) {
            this.events[event] = [];
        }
        // 解耦
        this.events[event].push(fn);
    }
    off(event, fn) {
        const fns = this.events[event];
        if (!fns) {
            return;
        }
        this.events[event] = fns.filter(item => item !== fn);
    }
    // 发布
    emit(event, ...args) {
        const fns = this.events[event];
        if (!fns) {
            return;
        }
        // 拷贝一份，避免修改原数组
        fns.slice().forEach(fn => fn(...args));
    }
    once(event, fn) {
        const onceFn = (...args) => {
            fn(...args);
            this.off(event, onceFn);
        }
        this.on(event, onceFn);
    }
}