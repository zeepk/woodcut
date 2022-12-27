package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type TrackableUsers struct {
	Username string
	Id       int
}

type Player struct {
	Username string
	Id       int
	Data     string
}

func main() {
	var officialApiUrl = "https://secure.runescape.com/m=hiscore/index_lite.ws?player="
	var connectionString = "root:2tfLUbxn2nsLyrFzR6jP@tcp(containers-us-west-150.railway.app:7266)/railway"
	var apiUrl = "https://woodcut.vercel.app/api/cron"
	// var apiUrl = "http://localhost:3000/api/cron"
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	} else {
		fmt.Println("Connected to database")
	}
	defer db.Close()

	// query the database for the players to update
	results, err := db.Query("SELECT id, username FROM Player where isTracking = true")
	if err != nil {
		panic(err.Error())
	}

	// add usernames to list so we can hit the endpoint for those players
	var players []Player
	for results.Next() {
		var trackingPlayers TrackableUsers
		err = results.Scan(&trackingPlayers.Id, &trackingPlayers.Username)
		if err != nil {
			panic(err.Error())
		}
		player := Player{Username: trackingPlayers.Username, Id: trackingPlayers.Id, Data: ""}
		players = append(players, player)
	}

	// hitting the official game API for each player
	client := &http.Client{}
	for i := 0; i < len(players); i++ {
		req, err := http.NewRequest("GET", officialApiUrl+players[i].Username, nil)
		if err != nil {
			fmt.Print(err.Error())
		}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Print(err.Error())
		}
		defer resp.Body.Close()
		if err != nil {
			fmt.Print(err.Error())
		}
		if resp.StatusCode == 404 {
			fmt.Println("User not found: " + players[i].Username)
			os.Exit(1)
		}

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)
		responseString := buf.String()
		players[i].Data = responseString
	}

	// make a post request to TS server with all player data
	testBody, _ := json.Marshal(players)

	req, err := http.NewRequest(
		"POST", apiUrl,
		bytes.NewBuffer(testBody))
	if err != nil {
		fmt.Print(err.Error())
	}
	client.Do(req)

	return
}
