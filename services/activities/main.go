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
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

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

type RawItemDetails struct {
	id        string
	timestamp string
	price     int
	volume    string
}

type Replacement struct {
	old string
	new string
}

type ItemDetails struct {
	Id          int
	LastUpdated string
	Price       int
	ImageUri    string
	Stale       int
	Name        string
	IsUpdated   bool
}

func checkForReplacements(item string, replacements []Replacement) string {
	for i := 0; i < len(replacements); i++ {
		if strings.Contains(item, replacements[i].old) {
			item = strings.Replace(item, replacements[i].old, replacements[i].new, 1)
		}
	}

	return item
}

func generateActivityQuery(username string, playerId int, activity Activity, price int, imageUri string) string {
	priceString := fmt.Sprintf("%d", price)
	// format values
	valueStatement := fmt.Sprintf("(%d, STR_TO_DATE('%s', '%%d-%%M-%%Y %%k:%%i'), '%s', \"%s\", \"%s\", \"%s\", %s, 0 , '%s')", playerId, activity.Date, activity.Date, activity.Text, activity.Details, imageUri, priceString, username)

	return valueStatement
}

// get item name from activity text
func getItemName(activity string) string {
	item := ""
	terms := []string{
		"I found a pair of ",
		"I found some ",
		"I found an ",
		"I found a ",
		"I found ",
		"Found a ",
	}

	for i := 0; i < len(terms); i++ {
		if strings.Contains(activity, terms[i]) {
			item = strings.Replace(activity, terms[i], "", 1)
			item = strings.Replace(item, ".", "", 1)
			i = len(terms)
		}
	}

	return item
}

// get item id and price from item name
func getItemDetails(item string) (string, int) {
	id := ""
	price := -1

	priceUrl := "https://api.weirdgloop.org/exchange/history/rs/latest?name="

	client := &http.Client{}
	req, err := client.Get(priceUrl + item)
	if err != nil {
		fmt.Print(err.Error())
	}

	defer req.Body.Close()
	b, err := io.ReadAll(req.Body)
	// convert byte array to string
	body := string(b)

	d := json.NewDecoder(strings.NewReader(body))
	d.UseNumber()
	var f interface{}
	if err := d.Decode(&f); err != nil {
		log.Fatal(err)
	}
	_, err = json.Marshal(f)
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		fmt.Println("Error parsing JSON: ", err)
	}

	// get price property
	var itemResults map[string]map[string]string
	json.Unmarshal([]byte(body), &itemResults)

	keys := make([]string, 0, len(itemResults))
	for key := range itemResults {
		keys = append(keys, key)
	}
	itemDetails := itemResults[keys[0]]
	id = itemDetails["id"]

	// get price property
	var itemPriceResults map[string]map[string]int
	json.Unmarshal([]byte(body), &itemPriceResults)

	keys = make([]string, 0, len(itemPriceResults))
	for key := range itemPriceResults {
		keys = append(keys, key)
	}
	itemPriceDetails := itemPriceResults[keys[0]]
	// print the number
	price = itemPriceDetails["price"]

	return id, price
}

// get item price from id
func getItemImageUri(itemId string) string {
	uri := ""

	priceUrl := "https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item="

	client := &http.Client{}
	req, err := client.Get(priceUrl + itemId)
	if err != nil {
		fmt.Print(err.Error())
	}

	defer req.Body.Close()
	b, err := io.ReadAll(req.Body)
	// convert byte array to string
	body := string(b)

	// if body contains Page not found, the item is not on the GE
	if strings.Contains(body, "Page not found") {
		return ""
	}

	d := json.NewDecoder(strings.NewReader(body))
	d.UseNumber()
	var f interface{}
	if err := d.Decode(&f); err != nil {
		log.Fatal(err)
	}
	_, err = json.Marshal(f)
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		fmt.Println("Error parsing JSON: ", err)
	}

	// get price property
	var itemResults map[string]map[string]string
	json.Unmarshal([]byte(body), &itemResults)

	itemDetails := itemResults["item"]
	uri = itemDetails["icon_large"]
	return uri
}

func main() {
	start := time.Now()
	args := os.Args[1:]
	force := false
	if len(args) > 0 {
		force = args[0] == "--force" || args[0] == "-f"
		fmt.Println("FORCING RELOADING OF ACTIVITY DATA")
	}

	cachedItems := make(map[string]ItemDetails)

	replacements := []Replacement{
		{"wristwraps", "wrist wraps"},
		{"Scriptures", "Scripture"},
		{"Erethdor's grimoire", "Erethdor's grimoire (token)"},
	}

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
			price := 0
			imageUri := ""

			// check if there is an item
			itemName := getItemName(t.Activities[j].Text)
			if len(itemName) != 0 {
				itemNameCache := strings.Join(strings.Split(itemName, " "), "_")
				itemNameCache = strings.ToLower(itemNameCache)

				// if in the cache, we can skip the API calls
				val, ok := cachedItems[itemNameCache]
				shouldUseCache := !force && ok && val.Stale == 0
				if shouldUseCache {
					price = val.Price
					imageUri = val.ImageUri
				} else {
					itemName = checkForReplacements(itemName, replacements)
					// get the item id and price
					itemId, itemPrice := getItemDetails(itemName)
					price = itemPrice

					// get the image uri
					imageUri = itemId

					numericItemId, _ := strconv.Atoi(itemId)

					// if not already, cache the item's price and image uri
					cachedItems[itemNameCache] = ItemDetails{Name: itemNameCache, Price: itemPrice, ImageUri: imageUri, Stale: 1, Id: numericItemId, IsUpdated: true}
					// if _, ok := cachedItems[itemNameCache]; !ok {
					// 	cachedItems[itemNameCache] = ItemDetails{Name: itemNameCache, Price: itemPrice, ImageUri: imageUri, Stale: 1, Id: numericItemId}
					// }

				}
				log := "Item name: " + itemName
				if shouldUseCache {
					log += " (cached)"
				}

				fmt.Println(log)
			}

			queryString += generateActivityQuery(players[i].Username, players[i].Id, t.Activities[j], price, imageUri)
			if j != len(t.Activities)-1 {
				queryString += ","
			}
		}

		queryString += " ON DUPLICATE KEY UPDATE price=VALUES(price), imageUrl=VALUES(imageUrl), importance=VALUES(importance)"
		// fmt.Println(queryString)

		// execute insert statement
		_, err = db.Exec(queryString)
		if err != nil {
			panic(err.Error())
		}

		log := fmt.Sprintf("> activities added for: %s", players[i].Username)
		fmt.Println(log)
		fmt.Println(queryString)
	}

	log := fmt.Sprintf("Added activities for %d players", len(players))
	fmt.Println(log)

	duration := time.Since(start)
	// Formatted string, such as "2h3m0.5s" or "4.503μs"
	fmt.Println("Time elapsed: ", duration)
	return
}
