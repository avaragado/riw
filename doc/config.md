# riw configuration

## Location

You can place riw configuration in:

- **Either** a configuration file of your choosing (which you specify with the `--config` option whenever you run the `riw` command)
- **Or** the file `.riw-config.js` at the root of your package (in the same directory as your `package.json`)
- **Or** under the `riw` key in your `package.json`

The `riw` command looks for configuration in the order shown above. If you include configuration in more than one location, only the first configuration found is used.

Your configuration settings override the built-in defaults. To see the full configuration in use, including your overrides, use the `riw print-config` command (with the `--config` option if necessary).


## Configuration file type

If you use a standalone configuration file (either `.riw-config.js` or one you specify using `--config`), riw expects this to be a node module that exports an object.

For the `package.json` file's `riw` key, you may use only JSON data.


## Configuration options

For options with type `Path` or `Glob`, the string value is a filesystem path. Relative paths are treated as relative to the configuration file.

### `defaultLocale`

- Type: `LocaleId`
- Default value: `en-us`

The locale id that riw assigns to every `react-intl` message descriptor's `defaultMessage`.

### `targetLocales`

- Type: `LocaleId[]`
- Default value: `[]`

The locales you want to translate to for this app. The riw translations database may contain locales not in this list (because apps can share databases).

### `translationsDatabaseFile`

- Type: `Path`
- Default value: `src/locale/riw-db.json`

The filesystem path to the translations database used by riw. Multiple apps can share the same translations database, with different target locales.

### `sourceDirs`

- Type: `Glob[]`
- Default value: `['src/**/*.js']`
- Ignored if `inputMode` is not `source`.

Array of glob patterns identifying your source files.

When `inputMode` is `source`, riw parses all files matching this pattern looking for `react-intl` message descriptors to translate. (riw uses `babel-plugin-react-intl` to perform the parsing.)


### `collateDir`

- Type: `Path`
- Default value: `tmp/babel-plugin-react-intl`
- Ignored if `inputMode` is not `json`.

The filesystem path to a directory containing JSON files (in any tree structure). Each file is assumed to contain the output of `babel-plugin-react-intl`: an array of `react-intl` message descriptors.

When `inputMode` is `json`, riw collates these JSON files for translation and does not read your source files.


### `inputMode`

- Type: `source` | `json`
- Default value: `source`

How riw should locate the `react-intl` message descriptors to translate.

- Use `source` and set `sourceDirs` if you want riw to extract message descriptors from your source files using `babel-plugin-react-intl`.
- Use `json` and set `collateDir` if you want riw to use message descriptors already extracted from your source files by another process, for example webpack.

### `translationsOutputFile`

- Type: `Path`
- Default value: `src/locale/[locale].json`
- Ignored if `outputMode` is `no-file`.

The filesystem path template that identifies where riw saves translations. Use the placeholder `[locale]` literally: riw replaces this as necessary.

- When `outputMode` is `file-per-locale`, riw replaces `[locale]` with the appropriate locale id.
- When `outputMode` is `single-file`, riw replaces `[locale]` with the literal string `locales`.


### `todoFile`

- Type: `Path`
- Default value: `src/locale/TODO-untranslated.json`
- Ignored if `outputMode` is `no-file`.

The filesystem path that identifies where riw saves message descriptor and locale data for messages that still need to be translated into some or all of your target locales.


### `outputMode`

- Type: `single-file` | `file-per-locale` | `no-file`
- Default value: `file-per-locale`

How riw outputs translated strings for your app.

riw processes your app's `react-intl` message descriptors (found according to `inputMode`) and the configured translations database to discover matching translations. This setting determines whether and how riw should write those translations to disk.

- Use `single-file` and set `translationsOutputFile` if you want riw to save translations for all locales in one file. This option is best if your app ships with every locale embedded statically (for example, an app built with Electron).
- Use `file-per-locale` and set `translationsOutputFile` if you want riw to save translations for each locale in a separate file. This option is best if your app loads locale information on demand (for example, a web app).
- Use `no-file` and ignore `translationsOutputFile` if you don't want riw to save the translations. This option is best if you're using the riw API directly.

If `outputMode` is `single-file` or `file-per-locale`, riw saves message descriptor and locale data for untranslated messages in the configured `todoFile`. If `outputMode` is `no-file`, this data is not saved to a file.
