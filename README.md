# stylelint-no-unresolved-module

[![Build Status][ci-img]][ci]

Ensures an module (import-like or `url`) can be resolved to a module on the
local filesystem.

## Install

```sh
npm install stylelint-no-unresolved-module --save
```

## Usage

```js
// Module usage
```

More usage examples.

## API

### methodName(arg, [optionalArg])

Returns: `Mixed`

Method description.

#### arg

Type: `Mixed`

arg description.

#### optionalArg

Type: `Object`

optionalArg description.

##### prop1

Type: `String`  
Default: `'3'`

`prop1` description.

##### prop2

Type: `Number`  
Default: `3`

##### prop3

Type: `Number[]`  
Default: `[1, 2, 3]`

##### prop4

Type: `Number[]` `String[]`  
Default: `['1', '2', '3']`

`prop4` description.

##### prop5

Type: `Function`  
Default: `noop`

`prop5` description.

Function arguments:

-   **arg1** `String` arg1 description
-   **arg2** `Number` arg2 description
-   **arg3** `Element` `Boolean` arg3 description

> Alternative approach

| Property | Type                  | Default           | Description                                              |
| -------- | --------------------- | ----------------- | -------------------------------------------------------- |
| `prop1`  | `String`              | `'3'`             | `prop1` description.                                     |
| `prop2`  | `Number`              | `3`               | `prop2` description.                                     |
| `prop3`  | `Number[]`            | `[1, 2, 3]`       | `prop3` description.                                     |
| `prop4`  | `Number[]` `String[]` | `['1', '2', '3']` | `prop4` description.                                     |
| `prop5`  | `Function`            | `noop`            | `prop5` description. (No function arguments description) |

---

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/stylelint-no-unresolved-module
[ci-img]: https://travis-ci.com/niksy/stylelint-no-unresolved-module.svg?branch=master

<!-- prettier-ignore-end -->
