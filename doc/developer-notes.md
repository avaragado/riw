# Developer notes

## Variable naming scheme and flowtype types

This repo uses a Hungarian-style naming scheme for variables. This is in addition to flowtype types.

There's a one-to-many mapping between flowtype types and variable naming prefixes. For example, both `fabs` and `dabs` variables have type `AbsolutePath`. Not all kinds of variable in the scheme have a dedicated flowtype type. Not all flowtype types have a naming prefix.

| Hungarian | Flowtype | Meaning |
| --- | --- | --- |
| `fabs` | `AbsolutePath` | Absolute path to file, eg `/foo/bar/baz.txt` |
| `frel` | `RelativePath` | Relative path to file, eg `bar/baz.txt` |
| `dabs` | `AbsolutePath` | Absolute path to directory, eg `/foo/bar/` |
| `drel` | `RelativePath` | Relative path to directory, eg `bar/` |
| `pabs` | `AbsolutePath` | Absolute path to file or directory |
| `prel` | `RelativePath` | Relative path to file or directory |
| `path` | `Path` | Either a relative or an absolute path, to a file or directory |
| `rdb` | `RIWDB` | An riw translation database object |
| `json` | – | A JSON string (NOT an object) |

