# midicontroller

## SetUp

```sh
npm install
```

### Husky Hooks Activation

```sh
npx husky install
```

### Husky Commit Message Check

```sh
## linux / macos
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

## windows
npx husky add .husky\commit-msg "npx --no -- commitlint --edit $1"
```

### Initialize the Conventional Changelog adapter

```sh
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

---

## Note su Commit e Release

```sh
npm run cm
```

[Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)

### Version Release

```sh
npm run release
```

#### NB: in caso di prima commit del progetto il comando corretto è

```sh
npm run release -- --first-release
```

Per effettuare la prima release è necessario che il progetto abbia almeno una commit.

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## Usefull links

-   [Vue](https://vuejs.org/guide/introduction.html) - Framework di sviluppo interfaccia grafica
-   [Vue Router](https://router.vuejs.org/) - Routing system built-in in Vue
-   [Vite](https://vitejs.dev/guide/) - Developement server con HRM
-   [Vitest](https://vitest.dev/guide/) - Test runner per Unit Test
-   [Cypress](https://docs.cypress.io/guides/overview/why-cypress) - FrontEnd E2E testing tool
-   [Pinia](https://pinia.vuejs.org/introduction.html) - Library di gestione degli stati
-   [Tailwindcss](https://tailwindcss.com/docs/installation) - CSS Framework
-   [StackOverflow](https://stackoverflow.com/) - La Bibbia
