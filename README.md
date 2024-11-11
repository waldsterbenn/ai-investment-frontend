# ai-investment-frontend

A vue project.

# Install required software

If you have not made a Vue app before, we need to install some software.

## Node server components

[Node.js 22.11](https://nodejs.org/en/download/package-manager)

## Yarn package manager

[Yarn 4.5.1](https://yarnpkg.com/getting-started/install)

I don't think you need to run the init command, described on the yarnpkg website, since the yarn project is already instantiated in this repo.

## VSCode extention

Install **"Vue - Official"** VSCode extention.
From the Extentions menu (`Ctrl+Shift+X`)

This this (i think) integrates VSCode with vue app running in browser for seamless debugging.

## Check out the Vue docs

https://vuejs.org/guide/quick-start.html

# Start webapp first time

This repo is already configured with a Vue.js app, so you should be able to just run vue app on localhost:

```
    cd ai-investment-frontend
    yarn
    yarn dev
```

Running the single `yarn` command will make the package manager spin through the package.json and install the required _"dependencies"_. So you should only run this the first time or when you change the package.json dependencies.

When starting the app next time, there is no need to run the yarn command whithout parameters.

Just run `yarn dev` to start the webapp.

# Other scripts

Run any of the other _"scripts"_ defined in: ai-investment-frontend\package.json

For example: `yarn lint`, to run the linter and check source files for errors and syntax problems.
