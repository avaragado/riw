# riw

riw ("`react-intl` workflow") is a set of command-line tools and a library to help you work with `react-intl` in a React app. Use it to:

- Define target locales for your app: the locales into which you translate the app.
- Extract `react-intl` message descriptors from your React components, directly or indirectly.
- Check for duplicates in your `react-intl` message descriptor ids.
- Manage translations for each target locale.
- Generate JSON files for your translations, to include in your app.

This project is not associated with the `react-intl` project.

The word "riw" seems to be Welsh for slope or hill, and rhymes with the English word "drew".


## Which problems doesn't riw solve?

- riw doesn't perform any automated text translation or interface with any translators or translation services. It tells you which messages need translating, lets you update its translations database with the translations once you have them, and produces shippable, `react-intl`-compatible JSON files for each locale you want to support.

- riw doesn't provide a mechanism for generating unique `react-intl` message descriptor ids. How you define these depends on your app's requirements. However, it does let you identify any duplicate ids.

- riw doesn't import the generated JSON locale files into your app or plug them into `react-intl`'s `IntlProvider`. You implement this behaviour yourself.


## Assumptions

riw assumes you're familiar with `react-intl`, and that your app already uses a build system of some kind (for example, webpack).


## TL;DR

1. `yarn add --dev riw`
1. Add to `package.json`:
   ```json
   "riw": {
       "defaultLocale": "en-us", // locale of the source strings
       "targetLocales": ["fr-fr", "pt-br", ...], // other locales the app should support
   }
   ```
1. `yarn run riw db init` – initialise empty db at `src/locale/riw-db.json`
1. `yarn run riw app translate` – outputs `src/locale/[locale].json` and `src/locale/TODO-untranslated.json`
1. Update your app to import strings from `src/locale/[locale].json` for each target locale, and plug them into `react-intl`'s `IntlProvider` at the appropriate time.
1. LOOP:
1. Translate everything in the `TODO-untranslated.json` file. Meanwhile, keep developing your app in the usual way.
1. `yarn run riw db import TODO-with-translations.json` if you have a file of them in the right format, or
1. `yarn run riw db update <opts...>` to update the db string by string.
1. `yarn run riw app translate`
1. Go to LOOP.

Check everything into source control. There are no temporary files.

## More information

- [Installing, configuring and using riw](doc/tutorial.md)
- [Configuration settings](doc/config.md)
- [FAQ/troubleshooting](doc/faq.md)
- [Using riw programmatically](doc/library.md)
