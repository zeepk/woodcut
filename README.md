# Woodcut
[![daily-cron](https://github.com/zeepk/woodcut/actions/workflows/main.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/main.yml)
[![activities-update](https://github.com/zeepk/woodcut/actions/workflows/activities.yml/badge.svg)](https://github.com/zeepk/woodcut/actions/workflows/activities.yml)


<div align="left"><p>
    <a href="https://app.netlify.com/sites/curious-belekoy-c245c8/deploys">
      <img alt="Latest release" src="https://img.shields.io/netlify/1aa182f9-0f8c-47a1-b79d-865b2bffec26?style=for-the-badge&logo=starship&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41&include_prerelease&sort=semver" />
    </a>
    <a href="https://github.com/LazyVim/LazyVim/releases/latest">
      <img alt="Latest release" src="https://img.shields.io/github/v/release/zeepk/woodcut?style=for-the-badge&logo=starship&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41&include_prerelease&sort=semver" />
    </a>
    <a href="https://github.com/LazyVim/LazyVim/pulse">
      <img alt="Last commit" src="https://img.shields.io/github/last-commit/zeepk/woodcut?style=for-the-badge&logo=starship&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"/>
    </a>
    <a href="https://github.com/LazyVim/LazyVim/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/zeepk/woodcut?style=for-the-badge&logo=starship&color=c69ff5&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    <a href="https://github.com/LazyVim/LazyVim/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/zeepk/woodcut?style=for-the-badge&logo=bilibili&color=F5E0DC&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    <a href="https://github.com/LazyVim/LazyVim">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/zeepk/woodcut?color=%23DDB6F2&label=SIZE&logo=codesandbox&style=for-the-badge&logoColor=D9E0EE&labelColor=302D41" />
    </a>
</div>

Stat tracking app for RuneScape

## Stack

- Bootstrapped with the [T3 stack](https://create.t3.gg/)
- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

Deployed on Netlify

## Features

- Stat tracking
- Minigame score & rank tracking
- Activity display & tracking
- Cron job with Go script to update stats
- Unauth'd home page with activities and search
- Cron job with Go script to update activities
- TODO: Max/MaxTotal/120All/200mAll progress
- TODO: Auth'd accounts with Next-Auth
- TODO: Follow other players
- TODO: Auth'd dashboard with:
  - TODO: player data
  - TODO: followed players activities
