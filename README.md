<div align="center">

# json-bundler

**Bundles your JSON files intelligently.**

</div>

<br><br>

## What it does

When developing web applications, we often use JSON files in order to define content (e.g. for internationalization) or extracting some form
of configuration. Especially in the former case, we usually end up with one huge JSON file, probably a couple or hundred or thousand lines
long.

Meet the **json-bundler**, a NodeJS-based command line tool, enabling you to place multiple JSON files in multiple places - and bundle them
together intelligently.

> For example, the **json-bundler** allows you to place your i18n files directly next to your component implementations (e.g. next to
> Angular components), or to reference JSON files published within a npm library.

![JSON Bundler Preview](/docs/preview.png?raw=true)

<br><br><br>

## How to install

You can get the **json-bundler** via **npm** by either adding it as a new *devDependency* to your `package.json` file and running
`npm install`, or running the following command:

``` bash
npm install json-bundler
```

### Requirements

- **json-bundler** requires **NodeJS 10** (or higher) to be installed

<br><br><br>

## How it works

Using **json-bundler** means:

- **Entry Point**<br>
  There must be exactly one JSON file acting as the singular entry point (e.g. `index.json` or `en.json`).
- **References**<br>
  JSON files are referenced (and thus included) using the `$ref` key, and the path to the JSON file as the value. Reference
  paths are always relative to the JSON file they're being defined within. Paths starting with `~` are pointing to the project's
  `node_modules` folder (for easy npm library access).
- **Bundling**<br>
  When bundling, referenced JSON files get merged in (instead of just placed in), at the exact position in the JSNO files at
  which they're being referenced. Existing values will not be overwritten by referenced files (the "referencee" has always higher priority).

Also: Both `json` and `json5` files are supported, even in a mixed manner. That means you can do linebreaks, use comments, and much more.
See **[JSON5](https://github.com/json5/json5)** for further details.

<br><br><br>

## How to use

It's recommended to use the json-bundler within one of your `package.json` scripts. For instance:

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
    "$ref": "./pages/login.json5"
  },
  "home": {
    "title": "Welcome back, it's Christmas time!",
    "$ref": "./pages/home.json"
  },
  "footer": {
    "$ref": "~my-library/i18n/footer.json"
  }
}
```

Second file at `src/app/pages/login.json5` (referenced file):

``` json5
// Login Page
{
  "title": "Login", // TODO: Rename to register?
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

Fourth file at `node_modules/my-library/i18n/footer.json` (referenced file):

``` json
{
  "copyright": "My company",
  "legal": "My super-duper important legal information. Plus imprint, of course."
}
```

**Notice that:**

- One JSON file can reference multiple other JSON files
- The place of the reference within the JSON structure will define where the referenced file gets merged in
- The paths are relative to the file they are defined within
- The `~` symbol can be used to access libraries (as a shortcut)
- The paths include the file ending (either `.json` or `.json5`)

<br>

### Bundling

We use the following command to create the bundle:

``` bash
json-bundler --entryFile src/app/en.json --outFile dist/en.json
```

**Notice that:**

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
  },
  "footer": {
    "copyright": "My company",
    "legal": "My super-duper important legal information. Plus imprint, of course."
  }
}
```

**Notice that:**

- Referenced files get merged in at the place they got referenced
- Files are included, no matter if they are `json` or `json5`, no matter if they exist within the project or come from a library
- The `home/title` has the value of the `src/app/en.json` file, and not the value defined in `src/app/pages/home.json` - the
  "parent" (aka the referencee) always has higher priority than the referenced file during merge
