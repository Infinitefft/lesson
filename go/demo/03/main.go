package main

import "fmt"


func main() {
	// chan 通道 主线程和协程之间的通信的通道
	// 传递数据的类型是 int 
	ch := make(chan int)

	go func() {
		ch <- 100
	}()
	// 从通道中接收数据
	// 阻塞主线程 等待协程执行完成

	num := <-ch
	fmt.Println(num)
}