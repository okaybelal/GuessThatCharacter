# Guess That Character

A multiplayer "Guess Who?" style game — each side secretly picks a character from a shared pack, then takes turns asking yes/no questions to figure out the other side's pick first.

Live at [guessthatcharacter.vercel.app](https://guessthatcharacter.vercel.app/).

## Features

- Play solo vs. solo, or team up with friends on Red/Blue teams
- Six character packs to choose from: Anime, Cartoon, Movie Character Actors, Musicians, TV Series Character Actors, and YouTubers
- Google sign-in with friends, online presence, and room invites (guests can still play without an account)
- Sound effects with a mute toggle

## Development

```bash
npm install
npm run dev
```

The frontend is a Vite + TypeScript app (`src/`); the backend is a set of Vercel serverless functions (`api/`) backed by Neon Postgres. Running the API locally requires the Vercel CLI:

```bash
npm run vercel:dev
```

## Build

```bash
npm run build
```
