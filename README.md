# stylelint-no-unresolved-module

[![Build Status][ci-img]][ci]

Ensures that module (import-like or `url`) can be resolved to a module on the
file system.

Nodes which are considered "modules":

-   `@import` at-rule in CSS and SCSS files (including [`pkg:`
    URLs][sass-pkg-url])
-   `@use` and `@forward` at-rule as
    [Sass modules](https://sass-lang.com/documentation/modules) (including
    [`pkg:` URLs][sass-pkg-url])
-   `url` declaration value for
    [various declaration properties](<https://developer.mozilla.org/en-US/docs/Web/CSS/url()>)

Features:

-   [`oxc-resolver`](https://github.com/oxc-project/oxc-resolver) to resolve
    each resource
-   Handling partials for Sass files

## Install

```sh
npm install stylelint-no-unresolved-module --save
```

## Usage

Add this config to your `.stylelintrc`:

```json
{
	"plugins": ["stylelint-no-unresolved-module"],
	"rules": {
		"plugin/no-unresolved-module": {
			"alias": {
				"assets": "pebbles"
			},
			"modules": ["node_modules", "local_modules"]
		}
	}
}
```

Assuming file system like this:

```
.
├── package.json
├── index.css
├── milo/
│   └── macy.css
├── node_modules/
│   └── josie/
│       ├── package.json
│       ├── rusty.css
│       └── index.css
└── local_modules/
    ├── pebbles/
    │   └── tucker.png
    └── shelby/
        └── shelby.css
```

Assuming code is run from `./index.css`:

```css
/**
 * These resources can be resolved */

@import url('josie');
@import url('shelby/shelby.css');
@import url('./milo/macy.css');

body {
	background: url('assets/tucker.jpg');
}

/**
 * These resources can’t be resolved */

@import url('shelby');
@import url('josie/misty.css');
@import url('./milo/index.css');

body {
	background: url('assets/sandy.jpg');
}
```

## Options

Plugin accepts either boolean (`true`) or object configuration.

If boolean, it will use default configuration:

-   No aliases
-   Look only inside `node_modules` for non-relative resource paths

If object configuration, following properties are valid:

### cwd

Type: `string`  
Default: `process.cwd()`

Root directory from where to start resolving resources. If it’s not defined,
directory of file will be used. Useful for situations where you don’t have
original file.

### alias

Type: `Object`

A list of module alias configurations or an object which maps key to value. See
[original documentation](https://github.com/oxc-project/oxc-resolver#options).

### modules

Type: `string[]`

A list of directories to resolve modules from. See
[original documentation](https://github.com/oxc-project/oxc-resolver#options).

### roots

Type: `string[]`

A list of root paths. See
[original documentation](https://github.com/oxc-project/oxc-resolver#options).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://github.com/niksy/stylelint-no-unresolved-module/actions?query=workflow%3ACI
[ci-img]: https://github.com/niksy/stylelint-no-unresolved-module/actions/workflows/ci.yml/badge.svg?branch=master
[sass-pkg-url]: https://sass-lang.com/documentation/js-api/classes/nodepackageimporter/

<!-- prettier-ignore-end -->
