# Developer notes

## Variable naming scheme

This repo uses a Hungarian-style naming scheme for variables. This is in addition to flowtype types.

There's a one-to-many mapping between flowtype types and variable naming prefixes. For example, both `fabs` and `dabs` variables have type `AbsolutePath`. Not all kinds of variable in the scheme have a dedicated flowtype type.

| Hungarian | Flowtype | Meaning |
| --- | --- | --- |
| `fabs` | `AbsolutePath` | Absolute path to file, eg `/foo/bar/baz.txt` |
| `frel` | – | Relative path to file, eg `bar/baz.txt` |
| `dabs` | `AbsolutePath` | Absolute path to directory, eg `/foo/bar/` |
| `drel` | – | Relative path to directory, eg `bar/` |

