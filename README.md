# Woodcut - a stat tracking app for RuneScape

[![Netlify Status](https://api.netlify.com/api/v1/badges/1aa182f9-0f8c-47a1-b79d-865b2bffec26/deploy-status)](https://app.netlify.com/sites/curious-belekoy-c245c8/deploys)
[![daily-cron](https://github.com/zeepk/woodcut/actions/workflows/main.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/main.yml)
[![activities-update](https://github.com/zeepk/woodcut/actions/workflows/activities.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/activities.yml)


## Stack

- Bootstrapped with the [T3 stack](https://create.t3.gg/)
- Auth with [Clerk.dev](https://clerk.dev)
- Database & ORM with [Prisma](https://prisma.io)
- Styling with [TailwindCSS](https://tailwindcss.com)
- Type-safe API requests with [tRPC](https://trpc.io)


## Current features

### Web app
- Stat tracking
- Minigame score & rank tracking
- Activity display & tracking
- Unauth'd home page with activities and search
- Cron job with Go script to update stats
- Cron job with Go script to update activities

## Planned features
> Check the [project board](https://github.com/users/zeepk/projects/2) to see development status
### Web app
- Max, Max Total, 120 All, 200m All progress
- Auth'd accounts with Clerk.dev, auth'd users can:
    - link their in-game player account(s)
    - "follow" other players
    - view a dashboard with personalized data
### CLI
- command line interface writtin in Go with various commands:
    - player stats & gains lookup
    - GE data for items
    - player comparisons
    - TBD: please [suggest](#suggestions)! 
### API
- public-ish API endpoints to surface information on:
    - player gains
    - player activities    
    - TBD: please [suggest](#suggestions)! 

## Suggestions
Very open to any suggestions! Reach out with a [Twitter DM](https://twitter.com/matthughes2112), [Discord](https://discord.gg/drcgC6GNM3), or [opening a Github issue](https://github.com/zeepk/woodcut/issues/new)! Use the `suggestion` tag and the appropriate app tag eg. `web`, `api`, or `cli`.
