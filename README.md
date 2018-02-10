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

When developing web applications, we often use JSON files in order to define content (e.g. for internationalization) or extracting some form
of configuration. Especially in the former case, we usually end up with one huge JSON file, probably a couple or hundred or thousand lines
long.

Meet the **json-bundler**, a NodeJS-based command line tool, enabling you to place multiple JSON files in multiple places - and bundle them
together intelligently.

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

Using the **json-bundler** is very straightforward. In general:

- There must be one JSON file acting as the entry point (e.g. `index.json` or `en.json` file).
- JSON files can be referenced (included) using the `$ref` key, and the path to the JSON file to be included as the value. Note that the
  path must be relative to the JSON file it is being referenced within.
- Referenced JSON files get merged in - not placed in - meaning that existing values will not be overwritten.
- Both `json` and `json5` files are supported, even when used in a mixed manner. *See __[JSON5](https://github.com/json5/json5)__ for
  further details*.

It's recommended to use the json-bundler within one of your package.json scripts. For instance:

``` json
{
  "scripts": {
    "json:bundle": "json-bundler --entryFile <PATH> --outFile <PATH>"
  }
}
```

The following parameters are available:

- `--entryFile <PATH>` (required) defines the path to the root JSON / JSON5 file
- `--outFile <PATH>` (required) defines the path to the output file
- `--minified` enables, if used, the minification of the output file (production build, in other words)
- `--watch` enables the watch mode - which comes in very handy during development

> You can always run `json-bundler --help` to get a full list of available command line parameters.

<br><br><br>

## Example

The following is a very simple example, demonstrating the basics of **json-bundler**. For further examples, feel free to take a look at the
**[unit tests](https://github.com/dominique-mueller/json-bundler/tree/develop/test)** of the library.

<br>

### Source

First file at `src/app/en.json` (entry file):

``` json
{
  "title": "My application title",
  "login": {
    "$ref": "./pages/login.json"
  },
  "home": {
    "title": "Welcome back, it's Christmas time!",
    "$ref": "./pages/home.json"
  }
}
```

Second file at `src/app/pages/login.json` (referenced file):

``` json
{
  "title": "Login",
  "form": {
    "user": "Please enter your username.",
    "password": "Please enter your password."
  }
}
```

Third file at `src/app/pages/home.json` (referenced file):

``` json
{
  "title": "Welcome back!",
  "description": "Lorem ipsum dolor sit amet."
}
```

Notice that:

- One JSON file can reference multiple other JSON files
- The place of the reference within the JSON structure will define where the referenced file gets merged in
- The paths are relative to the file they are defined within
- The paths include the file ending (either `.json` or `.json5`)

<br>

### Bundling

We use the following command to create the bundle:

``` bash
json-bundler --entryFile src/app/en.json --outFile dist/en.json
```

Notice that:

- We use the entry file from above
- We only define the required parameters here (`entryFile` and `outFile`)

<br>

### Output

The result is a JSON file at `dist/en.json`, and it contains the following:

``` json
{
  "title": "My application title",
  "login": {
    "title": "Login",
    "form": {
      "user": "Please enter your username.",
      "password": "Please enter your password."
    }
  },
  "home": {
    "title": "Welcome back, it's Christmas time!",
    "description": "Lorem ipsum dolor sit amet."
  }
}
```

Notice that:

- Referenced files get merged in at the place they got referenced
- The `home/title` has the value of the `src/app/en.json` file, and not the value defined in `src/app/pages/home.json` - the
  "parent" (aka the referencee) always has higher priority than the referenced file during merge

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
