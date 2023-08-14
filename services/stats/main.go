package main

import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

type TrackableUsers struct {
	Username string
	Id       int
}

type Player struct {
	Username string
	Id       int
}

func generateMinigameQuery(minigame string, minigameId int, playerId int) string {
	splitMinigame := strings.Split(minigame, ",")
	rank := splitMinigame[0]
	score := splitMinigame[1]

	s := fmt.Sprintf("(((select Max(m.id) from Minigame m) + 1), %d, %s, %s, (select Max(sr.id) from StatRecord sr where playerId = %d), CURRENT_TIMESTAMP())", minigameId, score, rank, playerId)

	return s
}

func generateSkillQuery(skill string, skillId int, playerId int) string {
	splitSkill := strings.Split(skill, ",")
	rank := splitSkill[0]
	level := splitSkill[1]
	xp := splitSkill[2]

	s := fmt.Sprintf("(((select Max(s.id) from Skill s) + 1), %d, %s, %s, %s, (select Max(sr.id) from StatRecord sr where playerId = %d), CURRENT_TIMESTAMP())", skillId, xp, level, rank, playerId)

	return s
}

func main() {
	var dryRun = false
	rootPassword := os.Getenv("MYSQL_ROOT_PASSWORD")

	var officialApiUrl = "https://secure.runescape.com/m=hiscore/index_lite.ws?player="
	var connectionString = "root:" + rootPassword + "@tcp(containers-us-west-150.railway.app:7266)/railway"

	// will be overwritten with necro
	var numSkills = 30

	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	} else {
		fmt.Println("Connected to database")
	}
	defer db.Close()

	// query the database for the players to update
	var queryString = "SELECT id, username FROM Player where isTracking = true"
	if dryRun {
		queryString = "SELECT id, username FROM Player where isTracking = true and id = 1"
	}

	results, err := db.Query(queryString)
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
		playerId := players[i].Id
		req, err := http.NewRequest("GET", officialApiUrl+players[i].Username, nil)
		if err != nil {
			fmt.Print(err.Error())
			continue
		}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Print(err.Error())
			continue
		}
		defer resp.Body.Close()
		if err != nil {
			fmt.Print(err.Error())
			continue
		}
		if resp.StatusCode == 404 {
			fmt.Println("User not found: " + players[i].Username)
			continue
		}

		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)
		responseString := buf.String()

		statRecordQuery := fmt.Sprintf("insert into StatRecord (playerId) values (%d);", playerId)
		_, err = db.Exec(statRecordQuery)
		if err != nil {
			panic(err.Error())
		}

		// split response on \n
		splitResponse := strings.Split(responseString, "\n")

		// skill insert
		var skillQuery strings.Builder
		skillQuery.WriteString("insert into Skill values ")

		for j := 0; j < numSkills; j++ {
			if splitResponse[j] != "" {
				skillQuery.WriteString(generateSkillQuery(splitResponse[j], j, playerId))
				if j != 28 {
					skillQuery.WriteString(",")
				} else {
					skillQuery.WriteString(";")
				}
			}
		}

		if !dryRun {
			_, err = db.Exec(skillQuery.String())
			if err != nil {
				panic(err.Error())
			}
		}

		// minigame insert
		var minigameQuery strings.Builder
		minigameQuery.WriteString("insert into Minigame values ")
		for j := numSkills; j < len(splitResponse); j++ {
			if splitResponse[j] != "" {
				minigameQuery.WriteString(generateMinigameQuery(splitResponse[j], j, playerId))
				if j != len(splitResponse)-2 {
					minigameQuery.WriteString(",")
				} else {
					minigameQuery.WriteString(";")
				}
			}
		}

		if !dryRun {
			_, err = db.Exec(minigameQuery.String())
			if err != nil {
				panic(err.Error())
			}
		}

		log := fmt.Sprintf("> created for: %s", players[i].Username)
		fmt.Println(log)
	}

	log := fmt.Sprintf("Created stat records for %d players", len(players))
	fmt.Println(log)
	return
}
