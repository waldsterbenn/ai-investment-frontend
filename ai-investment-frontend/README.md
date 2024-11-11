# ai-investment-frontend

# About
This is an app that act as frontend for another system that come up with insights into investment in specific stocks.
These are the building blocks used to realize the project:
1. Vue.js is a single page application framework where you code your website, as you would an app for windows or mobile. Vue helps with state management, routing and componentisation of code, to help organize how functionality is implemented. Essentially instead of making the website with HTML, you code it with Typescript (or Javascript). Although you also use a HTML like templating to describe the visual representation of the site. Similar concept as Angular or React, the website content adapt dynamically to changes in the underlying datamodel, so you don't have to manage updating data, rerendering and so on. [Vue](https://vuejs.org/)
1. Vite heps hosting, compiling and serving the app. It's a quick, modern and easy to use alternative to webpack. [Vite](https://vite.dev/)
1. Node.js is used as backend for the vue app, and the lib also provides vue with functionality. [Node](https://nodejs.org/en)
1. Yarn is a package manager that makes life easier. You also spin up local dev server, build for prod or run test using Yarn. [Yarn](https://yarnpkg.com/)

# Yarn packages for Vue
Packages are coded functionality, somebody made, that solves a common problem or implements a desired functionality. Basically you don't have to reinvent how to do something that has already been solved in a good way.
1. Pinia is used for state management in the app. [Pinia](https://pinia.vuejs.org/)
1. Vue routing is used to manage how the app directs to subpages in the site.
1. Prettier is used to help format and clean src code.

# Basic info and howto

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
