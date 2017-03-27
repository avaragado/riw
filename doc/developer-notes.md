# Developer notes

## Building and testing

The package uses [`nps`](https://www.npmjs.com/package/nps) as a layer above npm scripts. See [`package-scripts.js`](../package-scripts.js) for all the build targets. Common targets:

```bash
$ nps b    # or nps build - full build with linting and tests
$ nps b.q  # or nps build.quick - build without linting or tests
$ nps l    # or nps lint - lint js and check flow types
$ nps l.j  # or nps lint.js - lint js only
$ nps t    # or nps test - run tests
$ nps t.w  # or nps test.watch - test with watch
$ nps f    # or nps flow - check flow types
$ nps f.t  # or nps flow.typed - update all third-party types via flow-typed
```

## Branches and merging

When merging to master **Squash and Merge**.

In the commit message, follow [conventional-changelog-standard conventions](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md)


## Releasing

When ready to release to npm:

1. `git checkout master`
1. `git pull origin master`
1. `nps release`
1. Engage pre-publication paranoia
1. `git push --follow-tags origin master`
1. `npm publish`


## Tests

The lower-level modules have unit tests, usually based on Jest snapshots. Some of the wiring of these modules also has tests.

The CLI currently has no tests.


## CLI versus library

The CLI code in `src/bin` uses riw as a library and doesn't delve into the riw innards: only what's exported by `src/index.js` and `src/types.js`.


## Variable naming scheme and Flow types

This repo uses a Hungarian-style naming scheme for variables. This is in addition to [Flow](https://flowtype.org/) types.

There's a one-to-many mapping between Flow types and variable naming prefixes. For example, both `fabs` and `dabs` variables have type `AbsolutePath`. Not all kinds of variable in the scheme have a dedicated Flow type. Not all Flow types have a naming prefix.

| Prefix | Flow | Meaning |
| --- | --- | --- |
| `s` | `string` | A plain string |
| `ar` | `Array` | An array of something. eg `ars` is `string[]` (alternate: `s` suffix) |
| `ct` | `number` | An integer number usually indicating a total of some kind |
| `ix` | `number` | An integer index usually into an array for looping purposes, starts at 0 |
| `num` | `number` | An arbitrary number, not a `ct` or an `ix` |
| `is` | `boolean` | True or false |
| `has` | `boolean` | True or false |
| `are` | `boolean` | True or false |
| `json` | `string` | A JSON string (NOT an object) |
| `path` | `Path` | Either a relative or an absolute path, to a file or directory |
| `pabs` | `AbsolutePath` | Absolute path to file or directory |
| `prel` | `RelativePath` | Relative path to file or directory |
| `fabs` | `AbsolutePath` | Absolute path to file, eg `/foo/bar/baz.txt` |
| `frel` | `RelativePath` | Relative path to file, eg `bar/baz.txt` |
| `dabs` | `AbsolutePath` | Absolute path to directory, eg `/foo/bar/` |
| `drel` | `RelativePath` | Relative path to directory, eg `bar/` |
| `db` | `TranslationsDB` | An riw translation database object |
| `opt` | `Object` | An options object; may have a more specific Flow type in some circumstances |
| `quad` | `TranslationQuad` | A tuple describing a default message, description, locale and translation |
| `lid` | `LocaleId` | A locale id, eg `en-GB` or `pt-BR` |
| `md` | `MessageDescriptorWithFile` | A `react-intl` message descriptor plus a `file` property indicating the file the message descriptor came from |
| `mdu` | `UntranslatedMessageDescriptor` | A `react-intl` message descriptor plus a `locale` property indicating a locale to which the message descriptor is not yet translated |
| `mdt` | `TranslatedMessageDescriptor` | A `defaultMessage` and (optional) `description` as in a message descriptor, plus a `locale` property and a `translation` property with the message translated to that locale |


The `ar` prefix may be used before any of these to indicate an array of that type. For example, `ars` means an array of strings, and `armdt` means an array of translated message descriptors.

Using both prefixes and Flow types is somewhat redundant, but it helps to have an easy way to name things even if you're locking down the type. Also, some types are simple aliases (eg `AbsolutePath` is just an alias for `string`), and Flow doesn't care if you mix aliases corresponding to the underlying type, so a naming scheme helps here too.

Functions are often named with a prefix to indicate the return type, and with a suffix to identify the argument type. Usage here is less consistent than with variables, especially as many functions are higher-order and every variation of `createFooMakerFactoryBuilder` is ugly.
