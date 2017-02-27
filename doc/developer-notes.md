# Developer notes

## Variable naming scheme and flowtype types

This repo uses a Hungarian-style naming scheme for variables. This is in addition to flowtype types.

There's a one-to-many mapping between flowtype types and variable naming prefixes. For example, both `fabs` and `dabs` variables have type `AbsolutePath`. Not all kinds of variable in the scheme have a dedicated flowtype type. Not all flowtype types have a naming prefix.

| Hungarian | Flowtype | Meaning |
| --- | --- | --- |
| `s` | `string` | A plain string |
| `ar` | `Array` | An array of something. eg `ars` is `string[]` (alternate: `s` suffix) |
| `ct` | `number` | An integer number usually indicating a total of some kind |
| `ix` | `number` | An integer index usually into an array for looping purposes, starts at 0 |
| `num` | `number` | An arbitrary number, not a `ct` or an `ix` |
| `json` | `string` | A JSON string (NOT an object) |
| `path` | `Path` | Either a relative or an absolute path, to a file or directory |
| `pabs` | `AbsolutePath` | Absolute path to file or directory |
| `prel` | `RelativePath` | Relative path to file or directory |
| `fabs` | `AbsolutePath` | Absolute path to file, eg `/foo/bar/baz.txt` |
| `frel` | `RelativePath` | Relative path to file, eg `bar/baz.txt` |
| `dabs` | `AbsolutePath` | Absolute path to directory, eg `/foo/bar/` |
| `drel` | `RelativePath` | Relative path to directory, eg `bar/` |
| `db` | `RIWDB` | An riw translation database object |
| `opt` | `Object` | An options object; may have a more specific flowtype type in some circumstances |
| `quad` | `RIWDBQuad` | A tuple describing a default message, description, locale and translation |
| `lid` | `LocaleId` | A locale id, eg `en-gb` or `pt-br` |
| `md` | `RIWMessageDescriptor` | A `react-intl` message descriptor plus a `fabs` property indicating the file the message descriptor came from |
| `mdu` | `RIWMessageDescriptorUntranslated` | A `react-intl` message descriptor plus a `locale` property indicating a locale to which the message descriptor is not yet translated |


The `ar` prefix may be used before any of these to indicate an array of that type. For example, `ars` means an array of strings.
