# Woodcut - a stat tracking app for RuneScape

[![Netlify Status](https://api.netlify.com/api/v1/badges/1aa182f9-0f8c-47a1-b79d-865b2bffec26/deploy-status)](https://app.netlify.com/sites/curious-belekoy-c245c8/deploys)
[![daily-cron](https://github.com/zeepk/woodcut/actions/workflows/main.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/main.yml)
[![activities-update](https://github.com/zeepk/woodcut/actions/workflows/activities.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/activities.yml)

## Stack

- Bootstrapped with the [T3 stack](https://create.t3.gg/)
- [Clerk](https://clerk.dev)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

Deployed with Netlify

## Features

- Stat tracking
- Minigame score & rank tracking
- Activity display & tracking
- Cron job with Go script to update stats
- Unauth'd home page with activities and search
- Cron job with Go script to update activities
- Authenticated accounts
- Auth'd dashboard with:
  - player data
  - activities
  - TODO: followed players activities
- TODO: Max/MaxTotal/120All/200mAll progress
- TODO: Follow other players
