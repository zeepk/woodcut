package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type Activity struct {
	Date    string
	Details string
	Text    string
}

type Skill struct {
	Level int
	Xp    int
	Rank  int
	Id    int
}

type OfficialResponse struct {
	Magic            int
	Questsstarted    int
	Totalskill       int
	Questscomplete   int
	Questsnotstarted int
	Totalxp          int
	Ranged           int
	Activities       []Activity
	Skillvalues      []Skill
	Name             string
	Rank             string
	Melee            int
	Combatlevel      int
	LoggedIn         string
}

type TrackableUsers struct {
	Username string
	Id       int
}

type Player struct {
	Username string
	Id       int
}

func generateMinigameQuery(playerId int, activity Activity) string {
	// format
	// insert into Activity (playerId, occurred, text, details, imageUrl, price, importance, username) values
	// (1, STR_TO_DATE('16-Jan-2023 03:27', '%d-%M-%Y %k:%i'), 'testing text', 'details', '', 0, 0 , 'zee pk');

	// s := fmt.Sprintf("(((select Max(m.id) from Minigame m) + 1), %d, %s, %s, (select Max(sr.id) from StatRecord sr where playerId = %d), CURRENT_TIMESTAMP())", minigameId, score, rank, playerId)

	return ""
}

func main() {
	rootPassword := os.Getenv("MYSQL_ROOT_PASSWORD")
	var urlPre = "https://apps.runescape.com/runemetrics/profile/profile?user="
	var urlPost = "&activities=20"
	var connectionString = "root:" + rootPassword + "@tcp(containers-us-west-150.railway.app:7266)/railway"
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	} else {
		fmt.Println("Connected to database")
	}
	defer db.Close()

	// query the database for the players to update
	results, err := db.Query("SELECT id, username FROM Player where isTracking = true && id = 1")
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
		player := Player{Username: trackingPlayers.Username, Id: trackingPlayers.Id}
		players = append(players, player)
	}

	// hitting the official game API for each player
	client := &http.Client{}
	for i := 0; i < len(players); i++ {
		req, err := client.Get(urlPre + players[i].Username + urlPost)
		if err != nil {
			fmt.Print(err.Error())
			continue
		}

		defer req.Body.Close()
		decoder := json.NewDecoder(req.Body)
		t := new(OfficialResponse)
		decoder.Decode(t)
	}

	log := fmt.Sprintf("Created stat records for %d players", len(players))
	fmt.Println(log)
	return
}
