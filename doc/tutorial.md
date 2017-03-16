# Installing, configuring and using riw

## Overview

A React app usually consists of a large number of components. Each component may display messages to the user. When we internationalise a component with `react-intl` we typically remove these strings from the innards of a render method and define them separately, but nearby, as `react-intl` message descriptors: objects with a unique id, default message (the string), and optional description (important context for translators).

Default message strings within message descriptors typically have three purposes:

- As **fallbacks**, for use if `react-intl` can't find a string with the correct message descriptor id from the currently defined id/string mappings plugged into `IntlProvider`.
- As strings in the **default locale** (AKA base locale, master locale, source locale). If your developers or UX engineers use `en-gb` for these strings, consciously or unconsciously, your default locale is `en-gb`.
- As the **translation source**, together with any associated descriptions, supplied to a translation service.

With `react-intl`, to translate a component you need to:

1. Extract each "default locale" string for that component
1. Find a translation for that string in each locale you want your app to support
1. Store the translation in a file your app can load at the right time and then plug in to `IntlProvider`.

**riw helps you do all three**. It can't perform the translation itself, but it can look up translations already performed (it maintains a database), and it outputs the strings that still need to be translated.

riw also gives you housekeeping tools: for checking how complete your translations are, for modifying its database, and so on.

Importantly, riw fits into your current development process and does not constrain it. Used at appropriate times, riw can ensure you ship only the translations you need, and never ship any out-of-date translations.


## Concepts and jargon

- **App**: The software being translated. Usually equivalent to an npm module with a `package.json` file. Each app has its own riw configuration settings, and several apps may share a translations database.

- **Translations database**: The JSON file containing the master list of default messages and any associated descriptions, plus the available translations of those messages into one or more locales. riw reads and writes to this database. One database may be used by one or more app.

- **Default locale**: The locale of your app's `react-intl` default messages (the `defaultMessage` strings of message descriptors). This is usually but not necessarily a user-selectable locale for your app.

- **Target locale**: A locale you want your app to support (other than the default locale).

- **Locale id**: This document uses `ll-tt` format for locale ids: lower case for locale and for territory/region, with a dash as separator. You can use any string format you want, eg `lll_TTT`, BUT you must be consistent. In particular, you must use the same format in your app and for the translations database.

## Using riw

If you enjoy scrolling through diffs, the [riw-example](https://github.com/avaragado/riw-example) repostory shows how to take a simple React app with hardcoded strings, internationalise it with `react-intl`, and then use it with riw.

Meanwhile, here's the view from 10,000 feet:

1. Install riw
1. Define your riw configuration settings – primarily the default and target locales
1. Initialise the riw translations database
1. Initialise the riw output files
1. Update your app to load strings from the output files
1. Forever:
   1. Translate the untranslated strings, while continuing to develop the app normally
   1. Update the riw translations database
   1. Regenerate the riw output files
   1. Maybe ship

Let's look at each of these in turn.

### ➊ Install riw

You can install riw as a package dependency or globally.

```bash
$ yarn add --dev riw   # or yarn global add riw
```

or

```bash
$ npm install --save-dev riw   # use npm -g for global
```

If installed globally, `riw` does NOT defer to a local package dependency if there is one. These instructions assume you've installed riw as a package dependency.

Installing riw gives you a script for use from the command line, and a [library for use programmatically](./library.md).

The script is installed at `node_modules/.bin/riw`.  Users of `yarn` can run the script easily:

```bash
$ yarn run riw
```

### ➋ Define your riw configuration settings

riw has a small number of [configuration settings](./config.md), and you can store them in one of several locations:

| Location | Description |
| --- | --- |
| Under the `riw` key of your `package.json` file | Recommended |
| As the default export of a module `.riw-config.js` in the same directory as your `package.json` file | Use this if you need to derive any configuration settings programmatically |
| As the default export of a module elsewhere | Use this if you can't use either method above. You'll need to run the `riw` command with the `--config` option to locate the file. |

riw doesn't combine these locations: if you specify `--config`, riw won't look in `package.json` or `.riw-config.js`. If you omit `--config` and there's a `.riw-config` file, riw won't look in `package.json`.

riw uses the configuration from one of these locations to override the default settings. See [riw configuration](./config.md) for all the settings and their defaults.

Make sure you check your configuration settings into git, or whichever source control system you use.

Once riw is installed, you can see the current configuration settings in full using `riw print-config`. For example:

```
$ riw print-config
{
    "rootDir": "/Users/avaragado/my-react-app",
    "defaultLocale": "en-us",
    "targetLocales": [],
    "translationsDatabaseFile": "src/locale/riw-db.json",
    "sourceDirs": [
        "src/**/*.js"
    ],
    "collateDir": "tmp/babel-plugin-react-intl",
    "inputMode": "source",
    "translationsOutputFile": "src/locale/[locale].json",
    "outputMode": "file-per-locale",
    "todoFile": "src/locale/TODO-untranslated.json",
    "configFile": "/Users/avaragado/my-react-app/package.json"
}
```

Relative paths in your configuration settings are treated as relative to the `rootDir` output by `riw print-config`.

The most likely settings you'll want to override are:

- `targetLocales`: The value is an array of locale ids. For example: `["fr-fr", "pt-br"]` for French in France, and Brazilian Portuguese.
- `defaultLocale`: this defaults to `en-us` but your app might use another locale.


### ➌ Initialise the riw translations database

Many apps can share a translations database, potentially reducing translation costs. If you already have a translations database, include the path in your riw configuration settings and ignore this section.

If you don't already have a translations database, set one up now:

```bash
$ riw db init
```

With the default configuration settings, you'll now have a small file `src/locale/riw-db.json`. Check the file into source control.

Later, we'll explore what you can do with the database.


### ➍ Initialise the riw output files

Now we have some configuration settings and a database, we can run riw's most interesting command:

```bash
$ riw app translate
```

Depending on the size of your app, this might take some time to complete. This command:

1. Finds all `react-intl` message descriptors in your app. (By default, it uses the `react-intl` babel plugin to extract them from your code. If you have a build system that already does this, you can instead configure riw to pick up the JSON files this plugin outputs.)
1. Reports any duplicate message descriptor ids it finds. (`react-intl` leaves ids up to you, and it's easy to accidentally duplicate them, leading to confusing messages in your app.)
1. Looks up every message descriptor's defaultMessage and description (if present) in the translations database, for each of your app's target locales.
   - If a match is found, it's output in the appropriate locale file.
   - If no match is found, it's added to the TODO file.
1. Reports all the results.

Here's some example output:

```bash
✔ Found 943 message descriptors from 711 files
✔ No duplicate message descriptor ids
✖ Missing translations: 4715
✔ Saved /Users/avaragado/my-react-app/src/locale/fr-fr.json
✔ Saved /Users/avaragado/my-react-app/src/locale/es-es.json
✔ Saved /Users/avaragado/my-react-app/src/locale/de-de.json
✔ Saved /Users/avaragado/my-react-app/src/locale/pt-br.json
✔ Saved /Users/avaragado/my-react-app/src/locale/ja-jp.json
✔ Saved /Users/avaragado/my-react-app/src/locale/en-us.json
✔ Saved /Users/avaragado/my-react-app/src/locale/TODO-untranslated.json
```

Unsurprisingly, as your translations database is empty, you have lots of missing translations! If you look at the files in `src/locale`, you'll see that most of them are small: empty objects, `{}`.

However, the file for your default locale is complete: it contains mappings from `react-intl` id to strings for all the default messages currently defined in your code.

All the missing translations are in the TODO file, by default `src/locale/TODO-untranslated.json`, as an array of objects. Each object includes the `react-intl` id, default message and description (if defined), plus the file the message came from and the locale it needs to be translated into. Here's an example:

```json
{
    "id": "app.greeting",
    "defaultMessage": "Welcome to my wonderful app",
    "description": "Main body heading after user logs in",
    "file": "/Users/avaragado/my-react-app/src/components/Welcome.js",
    "locale": "fr-fr"
},
```

Check all these files into your source control system.

### ➎ Update your app to load strings from the output files

... and plug those strings and the current locale into the `react-intl` `IntlProvider` component.

How you do this depends on your app.

- You might load the strings for each locale **dynamically** using `require.ensure` or another mechanism. This is most appropriate for web apps, to reduce startup payload.
- You might load all strings **statically**. This is most appropriate for Electron-based apps, where startup payload isn't as much of an issue. In this case, you might want to configure riw with `outputMode` set to `single-file`: in this mode, riw puts all strings for all locales in a single JSON file.

If your app uses `redux` to manage state, we recommend you store all (currently loaded) strings in state, indexed by locale, together with a record of the current locale. Use the `connect` function from `react-redux` with suitable state selectors to supply `IntlProvider` with the strings for the current locale.

This connected component should render something like this:

```jsx
<IntlProvider key={idLocale} locale={idLocale} messages={messages}>
    ...
</IntlProvider>
```

where `idLocale` is the locale id, and `messages` is the object of id/string mappings for that locale.

Setting the `key` prop to `idLocale` ensures that when the locale id changes, the **entire subtree** correctly rerenders. See [`react-intl` issue 243](https://github.com/yahoo/react-intl/issues/243#issuecomment-166030664) for a discussion.

### ➏.➊ Translate the untranslated strings, while continuing to develop the app normally

Depending on your translation service and the number of translations required, it might take hours or days to translate the strings. You can continue developing your app while translation takes place. Bear in mind this might obsolete some of the translations in progress, but it doesn't affect how you use riw.

Different translation services have different requirements. The objects in the TODO file should contain everything your translators need.

(For reasons of sanity, we recommend you don't overlap requests to your translation service: wait until one request is complete before sending another. Consider reducing each request to a smaller batch of strings if you start feeling the urge to overlap requests.)

### ➏.➋ Update the riw translations database

**Caution** Sanity check all results from translators. [See the FAQ](./faq.md) for tips.

Translation services return completed translations in different ways. riw needs this data for each string:

- The string in the default locale that was supplied to the translation service
- The description that was supplied to the translation service, if any
- The locale for the translation
- The result of the translation

The ideal format: a JSON file with an array of objects, where each object has _at least_ the properties `defaultMessage`, `description` (if supplied to translators), `locale`, and `translation`. (The TODO file, augmented with a `translation` property for each object, works well.)

If you have a file in the ideal format, say `TODO-with-translations.json`, you can update the translations database with the command:

```bash
$ riw db import TODO-with-translations.json
```

If you can't produce a file in the suitable format for `riw db import`, you can update the database string by string using `riw db update`. For example:

```bash
$ riw db update --defaultMessage "Welcome to my wonderful app" --description "Main body heading after user logs in" --locale fr-fr --translation "Bienvenue dans ma merveilleuse application"
```

Check any changes to the translations database into source control.

Other useful `riw db` commands:

- `riw db find` returns entries matching certain criteria
- `riw db delete` deletes entries matching certain criteria
- `riw db status` shows information about the database such as the locales it contains and how complete each locale is

Use `riw db <command> --help` for usage information.

### ➏.➌ Regenerate the riw output files

After updating the translations database, regenerate the output files to bring them up to date:

```bash
$ riw app translate
```

Take a look at the output files in `src/locale/` to see how they've changed, and remember to check them into source control.

As this command extracts default messages from your source files, and those source files may have changed since you last ran the command, the TODO file generated this time may not be empty even if you fully translated the last TODO file.

At any time you can run `riw app status` to see the current state of your output files. This command warns if it thinks you need to run `riw app translate` – for example, if it looks like the database or the source files have changed since you last ran `riw app translate`, or if your riw configuration has changed.

If you remove a target locale, `riw app translate` does not remove that locale's output file, and `riw app status` ignores it. You can remove it if you want.

### ➏.➍ Maybe ship

The best time to ship a release is just after running `riw app translate`. All the generated files correspond to the source files at the time you run the command, and so contain only those strings you need, and no out-of-date strings in any locale.

Conversely, it's unwise to ship without running `riw app translate`: you may be shipping redundant and out-of-date strings.

After shipping (or not), the cycle begins again: translate untranslated strings and develop the app normally (back to ➏.➊).
