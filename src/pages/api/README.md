# Woodcut API

[![Netlify Status](https://api.netlify.com/api/v1/badges/1aa182f9-0f8c-47a1-b79d-865b2bffec26/deploy-status)](https://app.netlify.com/sites/curious-belekoy-c245c8/deploys)
[![daily-cron](https://github.com/zeepk/woodcut/actions/workflows/main.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/main.yml)
[![activities-update](https://github.com/zeepk/woodcut/actions/workflows/activities.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/activities.yml)

## Stack

- Bootstrapped with the [T3 stack](https://create.t3.gg/)
- ORM with [Prisma](https://prisma.io)
- Database hosted on [Railway](https://railway.app/)

## Available Endpoints

### Stat Tracking

`GET https://www.woodcut.dev/api/rs3/player?username=[username]`

#### Request Parameters

- `username`: username of the player to search for
  > Note for usernames, replace spaces with `+`, eg. `zee pk` becomes `zee+pk`

#### Response Structure

- `success: Boolean` - boolean for successful request
- `message: String` - error message in the event of an unsuccessful request
- `skills: Skill[]` - array of `Skill` objects:
  - `skillId: Number` - ID of the skill (TODO: link to list)
  - `rank: Number` - player's rank in the skill
  - `level: Number` - player's level in the skill
  - `xp: Number` - player's current xp in the skill
  - `dayGain: Number` - xp gain in the skill since the most recent reset
  - `yesterdayGain: Number` - xp gain in the skill between the most recent reset and the one before
  - `weekGain: Number` - xp gain in the skill since the beginning of the week (Sunday)
  - `monthGain: Number` - xp gain in the skill since the beginning of the month
  - `yearGain: Number` - xp gain in the skill since the beginning of the year
  - `dxpGain: Number` - xp gain in the skill between the beginning and end of the most recent [Double XP](https://runescape.wiki/w/Double_XP_Live#Events) event
- `minigames: Minigame[]` - array of `Minigame` objects:
  - `minigameId: Number` - ID of the minigame (TODO: link to list)
  - `rank: Number` - player's rank in the minigame
  - `score: Number` - player's current score in the minigame
  - `dayGain: Number` - score gain in the minigame since the most recent reset
  - `yesterdayGain: Number` - score gain in the minigame between the most recent reset and the one before
  - `weekGain: Number` - score gain in the minigame since the beginning of the week (Sunday)
  - `monthGain: Number` - score gain in the minigame since the beginning of the month
  - `yearGain: Number` - score gain in the minigame since the beginning of the year

#### Example Request

`GET https://www.woodcut.dev/api/rs3/player?username=zee+pk`

#### Example Response

```
{
    "success": true,
    "message": "",
    "skills": [
        {
            "skillId": 0,
            "rank": 3429,
            "level": 2898,
            "xp": 5307591820,
            "dayGain": 2191975,
            "weekGain": 2191975,
            "monthGain": 71469207,
            "yearGain": 565648426,
            "dxpGain": 65740473
        },
        ...
    ],
    "minigames": [
        {
            "minigameId": 29,
            "rank": 0,
            "score": 0,
            "dayGain": -25,
            "weekGain": -25,
            "monthGain": -25,
            "yearGain": -25
        },
        ...
    ],
}
```

## Planned Endpoints

> Check the [project board](https://github.com/users/zeepk/projects/2) to see development status

- player activities
- voice of seren
- TBD: please [suggest](#suggestions)!

## Suggestions

Very open to any suggestions! Reach out with a [Twitter DM](https://twitter.com/matthughes2112), [Discord](https://discord.gg/drcgC6GNM3), or [opening a Github issue](https://github.com/zeepk/woodcut/issues/new)! Use the `suggestion` tag and the `api` app tag.

## FAQ

Which skills/minigames to the `skillId`/`minigameId` correspond to?

0. Overall
1. Attack
2. Defence
3. Strength
4. Constitution
5. Ranged
6. Prayer
7. Magic
8. Cooking
9. Woodcutting
10. Fletching
11. Fishing
12. Firemaking
13. Crafting
14. Smithing
15. Mining
16. Herblore
17. Agility
18. Thieving
19. Slayer
20. Farming
21. Runecrafting
22. Hunter
23. Construction
24. Summoning
25. Dungeoneering
26. Divination
27. Invention
28. Archaeology
29. Bounty Hunter
30. B.H. Rogues
31. Dominion Tower
32. The Crucible
33. Castle Wars games
34. B.A. Attackers
35. B.A. Defenders
36. B.A. Collectors
37. B.A. Healers
38. Duel Tournament
39. Mobilising Armies
40. Conquest
41. Fist of Guthix
42. GG: Athletics
43. GG: Resource Race
44. WE2: Armadyl Lifetime Contribution
45. WE2: Bandos Lifetime Contribution
46. WE2: Armadyl PvP kills
47. WE2: Bandos PvP kills
48. Heist Guard Level
49. Heist Robber Level
50. CFP: 5 game average
51. AF15: Cow Tipping
52. AF15: Rats killed after the miniquest
53. RuneScore
54. Clue Scrolls Easy
55. Clue Scrolls Medium
56. Clue Scrolls Hard
57. Clue Scrolls Elite
58. Clue Scrolls Master
