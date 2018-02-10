<div align="center">

# json-bundler

**Bundles your JSON files intelligently.**

[![npm version](https://img.shields.io/npm/v/json-bundler.svg?maxAge=3600&style=flat)](https://www.npmjs.com/package/json-bundler)
[![dependency status](https://img.shields.io/david/dominique-mueller/json-bundler.svg?maxAge=3600&style=flat)](https://david-dm.org/dominique-mueller/json-bundler)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/json-bundler/master.svg?maxAge=3600&style=flat)](https://travis-ci.org/dominique-mueller/json-bundler)
[![Codecov](https://img.shields.io/codecov/c/github/dominique-mueller/json-bundler.svg?maxAge=3600&style=flat)](https://codecov.io/gh/dominique-mueller/json-bundler)
[![Known Vulnerabilities](https://snyk.io/test/github/dominique-mueller/json-bundler/badge.svg)](https://snyk.io/test/github/dominique-mueller/json-bundler)
[![license](https://img.shields.io/npm/l/json-bundler.svg?maxAge=3600&style=flat)](https://github.com/dominique-mueller/json-bundler/LICENSE)

</div>

<br><br>

## What it does

TODO: Description

![JSON Bundler Preview](/docs/preview.png?raw=true)

<br><br><br>

## How to install

You can get the **json-bundler** via **npm** by either adding it as a new *devDependency* to your `package.json` file and running
`npm install`, or running the following command:

``` bash
npm install json-bundler
```

### Requirements

- **json-bundler** requires **NodeJS 7.6** or higher to be installed

<br><br><br>

## How to use

Note upfront: It's recommended to use the json-bundler within one of your package.json scripts. For instance:

``` json
{
  "scripts": {
    "json:bundle": "json-bundler"
  }
}
```

The following parameters are available:

- `--entryFile <PATH>` (required) defines the path to the root JSON / JSON5 file
- `--outFile <PATH>` (required) defines the path to the output file
- `--minified` enables, if used, the minification of the output file (production build, in other words)
- `--watch` enables the watch mode - which comes in very handy during development

> You can always run `json-bundler --help` to get a full list of available command line parameters.

<br>

### Example

For example, **json-bundler** commands might look like the following:

``` json
{
  "scripts": {
    "json:dev": "json-bundler --entryFile ./src/i18n.json --outFile ./dist/i18n.json",
    "json:prod": "json-bundler --entryFile ./src/i18n.json --outFile ./dist/i18n.json --minified",
    "json:watch": "json-bundler --entryFile ./src/i18n.json --outFile ./dist/i18n.json --watch"
  }
}
```

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
