// 声明模块
package main

// 内置模块，fmt 格式化输出
import (
	"fmt"
)

// func 声明函数
func main() {
	fmt.Println("Hello Go");
	// 变量声明
	// var name string = "ez";
	age := 19
	age = 18
	fmt.Println(age)
	// 并发
}

func updateAge(age *int) {
	*age = 20
}