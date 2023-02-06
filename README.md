# Jimp on Vite

[![Deploy](https://github.com/danielholmes/jimp-vite/actions/workflows/deploy.yml/badge.svg)](https://github.com/danielholmes/jimp-vite/actions/workflows/deploy.yml)

Experiment to try and get JIMP working with Vite.

## Setting up Development

Install required system dependencies using [ASDF](https://asdf-vm.com/):

```bash
asdf install
```

or manually install them, see `./.tool-versions`.

Install dependencies:

```bash
npm ci
```

Apply jimp patches:

```bash
npx patch-package
```

## Running locally

```bash
npm run dev
```

## Current status

It's working for loading in a jpeg jimp file with no plugins.

Steps to get this working:

 1. Use a custom packaging of jimp to strip all features except jpeg parsing. This is just to prove the concept - the idea would be to add back plugins one by one and fix the related issues as they come up. See [./src/custom-jimp.ts](./src/custom-jimp.ts).
 2. Add polyfills for node modules (see [`./vite.config.ts`](./vite.config.ts)) and [`./src/node-polyfills.ts`](`./src/node-polyfills.ts`).
 3. Patch jimp packages to use proper ESM. i.e. almost all of JIMP is written in ESM but the code they provide in the package pointed to by `"module"` is not ESM. This is done via `patch-package`.
 4. Change `@jimp/core/src/request.js` to be proper ESM code. In this case it was commonJS file.
