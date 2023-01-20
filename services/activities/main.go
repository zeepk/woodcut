/*
Script for adding new activities to the database
- Query db for list of users to update (isTracking == true)
- For each player:
   - Hit the official game API for the player
   - Create insert statement
   - For each activity:
      - Add list of values to insert statement
   - Execute insert statement
- TODO: Run some sort of de-duping query
*/
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

func generateMinigameQuery(username string, playerId int, activity Activity) string {
	// format values
	valueStatement := fmt.Sprintf("(%d, STR_TO_DATE('%s', '%%d-%%M-%%Y %%k:%%i'), '%s', \"%s\", \"%s\", '', 0, 0 , '%s')", playerId, activity.Date, activity.Date, activity.Text, activity.Details, username)

	return valueStatement
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
	results, err := db.Query("SELECT id, username FROM Player where isTracking = true")
	if err != nil {
		panic(err.Error())
	}

	// loop through query results
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
		if t.Activities == nil || len(t.Activities) == 0 {
			continue
		}

		queryString := "insert into Activity (playerId, createdAt, occurred, text, details, imageUrl, price, importance, username) values "

		// loop through activities
		for j := 0; j < len(t.Activities); j++ {
			queryString += generateMinigameQuery(players[i].Username, players[i].Id, t.Activities[j])
			if j != len(t.Activities)-1 {
				queryString += ","
			}
		}

		queryString += " ON DUPLICATE KEY UPDATE occurred=occurred;"

		// execute insert statement
		_, err = db.Exec(queryString)
		if err != nil {
			panic(err.Error())
		}

		log := fmt.Sprintf("> activities added for: %s", players[i].Username)
		fmt.Println(log)
	}

	log := fmt.Sprintf("Added activities for %d players", len(players))
	fmt.Println(log)
	return
}
