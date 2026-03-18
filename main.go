	package main

	import (

		"fmt"
		"io"
		"net/http"
	)

	var ChatApi ="https://chat.joelsiervas.online"
	func getMessages(w http.ResponseWriter, r *http.Request) { 
		resp, _ :=http.Get(ChatApi + "/messages")
		io.Copy(w, resp.Body)
	}

	func postMessage(w http.ResponseWriter, r *http.Request) {
		resp, _ :=http.Post(ChatApi + "/messages", "application/json", r.Body)
		defer resp.Body.Close()

		io.Copy(w, resp.Body)
	}
	
	func main(){
		http.Handle("GET /", http.FileServer(http.Dir("static")))// lo que hace Handle en si es que recibe un metodo y luego un path y luego hace una fumciom 
		http.HandleFunc("GET /api/messages", getMessages)
		http.HandleFunc("POST /api/messages", postMessage)


		fmt.Println("Server running on port 8000")
		http.ListenAndServe("0.0.0.0:8000", nil)

	}
