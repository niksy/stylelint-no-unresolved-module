# Changelog

## [Unreleased][]

### Changed

-   Handle edge cases for interpolation

## [2.5.1][] - 2025-10-23

### Fixed

-   Recursively check for interpolation or variable in string for Sass files

## [2.5.0][] - 2025-10-23

### Added

-   Support for TypeScript configuration option
    ([#7](https://github.com/niksy/stylelint-no-unresolved-module/issues/7))

## [2.4.0][] - 2025-08-06

### Changed

-   Replace `enhanced-resolve` with `oxc-resolver`

### Fixed

-   Handle string when using `with` in Sass `@use` and `@forward`

## [2.3.0][] - 2024-08-23

-   Add support for Sass `pkg:` URLs
-   Expand condition names to include `default` export

## [2.2.2][] - 2024-02-26

### Changed

-   Allow Stylelint 16 as peer dependancy

## [2.2.1][] - 2023-09-08

### Fixed

-   Ignore data URLs
    ([#4](https://github.com/niksy/stylelint-no-unresolved-module/issues/4))

## [2.2.0][] - 2023-08-22

### Changed

-   Allow Stylelint 15 as peer dependancy
-   Update import statements to be ESM compatible
-   Use pure ESM as default
-   Upgrade package

## [2.1.0][] - 2023-03-02

### Added

-   Support for `enhanced-resolve` roots option

## [2.0.0][] - 2021-10-25

### Added

-   TypeScript types

### Changed

-   **Breaking**: Supports Node >= 12
-   **Breaking**: Supports Stylelint >= 14
-   Upgrade package

## [1.1.1][] - 2020-11-13

### Fixed

-   Parsing unqouted `url` values

## [1.1.0][] - 2020-11-13

### Changed

-   Allow array of aliases

### Fixed

-   Skip checking interpolated strings

## [1.0.1][] - 2020-11-05

### Fixed

-   Make fixtures `node_modules` available in project
    ([#1](https://github.com/niksy/stylelint-no-unresolved-module/pull/1))

## [1.0.0][] - 2020-11-05

### Added

-   Initial implementation

[1.0.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v1.0.0
[1.0.1]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v1.0.1
[1.1.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v1.1.0
[1.1.1]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v1.1.1
[2.0.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.0.0
[2.1.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.1.0
[2.2.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.2.0
[2.2.1]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.2.1
[2.2.2]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.2.2
[2.3.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.3.0
[Unreleased]:
	https://github.com/niksy/stylelint-no-unresolved-module/compare/v2.5.1...HEAD
[2.5.1]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.5.1

    https://github.com/niksy/stylelint-no-unresolved-module/compare/v2.5.0...HEAD

[2.5.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.5.0

    https://github.com/niksy/stylelint-no-unresolved-module/compare/v2.4.0...HEAD

[2.4.0]: https://github.com/niksy/stylelint-no-unresolved-module/tree/v2.4.0

    https://github.com/niksy/stylelint-no-unresolved-module/compare/v2.3.0...HEAD
