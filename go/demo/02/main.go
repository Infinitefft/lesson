package main

import (
	"fmt"
	"time"
)


func sayHello() {
	// 耗时性任务
	fmt.Println("Hello Go")
}


func main() {
	// go 关键字 告诉go 运行时
	// 在后台开启一个新的轻量级的协程来执行sayHello()
	go sayHello()
	fmt.Println("main")
	// 主线程
	// 阻塞主线程
	time.Sleep(time.Second)
}