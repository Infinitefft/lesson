package main

import (
	"fmt"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	// Fprintf 输出写入网路或者文件输出流
	fmt.Fprintf(w, "Hello World");
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}