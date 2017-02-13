# riw configuration

## Location

You can place riw configuration in:

- EITHER a configuration file of your choosing (which you specify with the `--config` option whenever you run the `riw` command)
- OR the file `.riw-config.js` at the root of your package (in the same directory as your `package.json`)
- OR under the `riw` key in your `package.json`

The `riw` command looks for configuration in the order shown above. If you include configuration in more than one location, only the first configuration found is used.

Your configuration settings override the built-in defaults. To see the full configuration in use, including your overrides, use the `riw print-config` command (with the `--config` option if necessary).


## Configuration file type

If you use a standalone configuration file (either `.riw-config.js` or one you specify using `--config`), riw expects this to be a node module that exports an object.

Inside the `package.json` file's `riw` key, you may use only JSON data.


## Configuration options

For options with type `Path`, the string value is a filesystem path. Relative paths are treated as relative to the configuration file.

### `defaultLocale`

- Type: `LocaleId`
- Default value: `en-us`

The locale id that riw assigns to every react-intl message descriptor's defaultMessage.

### `targetLocales`

- Type: `LocaleId[]`
- Default value: `[]`

The locales you want to translate to for this project. The riw translations database may contain locales not in this list.

### `translationsDatabaseFile`

- Type: `Path`
- Default value: `src/locale/riw-db.json`

The filesystem path to the translations database used by riw. Multiple projects can share the same translations database, with different target locales.
