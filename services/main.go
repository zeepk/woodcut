package main

import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type TrackableUsers struct {
	username string `json:"username"`
}

func main() {
	var officialApiUrl = "https://secure.runescape.com/m=hiscore/index_lite.ws?player="
	var connectionString = ""
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	} else {
		fmt.Println("Connected to database")
	}
	defer db.Close()
	results, err := db.Query("SELECT username FROM Player where isTracking = true")
	if err != nil {
		panic(err.Error())
	}

	var usernames []string
	for results.Next() {
		var trackingPlayers TrackableUsers
		err = results.Scan(&trackingPlayers.username)
		if err != nil {
			panic(err.Error())
		}
		usernames = append(usernames, trackingPlayers.username)
	}

	for i := 0; i < len(usernames); i++ {
		client := &http.Client{}
		req, err := http.NewRequest("GET", officialApiUrl+usernames[i], nil)
		if err != nil {
			fmt.Print(err.Error())
		}
		resp, err := client.Do(req)
		defer resp.Body.Close()
		if err != nil {
			fmt.Print(err.Error())
		}
		if resp.StatusCode == 404 {
			fmt.Println("User not found: " + usernames[i])
			os.Exit(1)
		}

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)
		responseString := buf.String()
		fmt.Println(usernames[i] + ": " + responseString)
	}
	return
}
