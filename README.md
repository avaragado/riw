# riw

riw ("`react-intl` workflow") is a set of command-line tools and a library to help you work with `react-intl` in a React app. Use it to:

- Define target locales for your app: the locales into which you translate the app.
- Extract `react-intl` message descriptors from your React components.
- Check for duplicates in your `react-intl` message descriptor ids.
- Manage translations for each target locale.
- Generate JSON files for your translations, to include in your app.

This project is not associated with the `react-intl` project.

The word "riw" seems to be Welsh for slope or hill, and rhymes with the English word "drew".


## Which problems doesn't riw solve?

- riw doesn't perform any automated text translation or interface with any translators or translation services. It tells you which messages need translating, lets you update its translations database with the translations once you have them, and produces shippable, `react-intl`-compatible JSON files for each locale you want to support.

- riw doesn't provide a mechanism for generating unique `react-intl` message descriptor ids. How you define these depends on your app's requirements. However, it does let you identify any duplicate ids.


## Assumptions

riw assumes you're familiar with `react-intl`, and that your app already uses a build system of some kind (for example, webpack).


## Concepts and jargon

- **App**: The software being translated. Usually equivalent to an npm module with a `package.json` file. Each app has its own riw configuration settings, and several apps may share a translations database.

- **Translations database**: The JSON file containing the master list of default messages and any associated descriptions, plus the available translations of those messages into one or more locales. riw reads and writes to this database. One database may be used by one or more app.

- **Default locale**: The locale of your app's `react-intl` default messages (the `defaultMessage` strings of message descriptors). This is usually but not necessarily a user-selectable locale for your app.

- **Target locale**: A locale your app must support (other than the default locale).

::TODO::


## Installation

```bash
$ yarn add --dev riw
```

or

```bash
$ npm install --save-dev riw
```

After installation there'll be a script `./node_modules/.bin/riw`. Users of `yarn` can run this easily:

```bash
$ yarn run riw
```

You can alternatively install `riw` globally. If used globally, `riw` does NOT defer to a local package dependency if there is one.

You might want to create a shell alias (eg `alias riw="yarn run riw --"`), modify your `PATH`, or install riw globally, so that typing `riw` runs an installed version.


## Tutorial

::TODO::
... another doc with a walkthrough of install, config, basic workflow


## Configuration

See the [configuration](doc/config.md) documentation.


## Usage

You can use riw from the command line or via a programmatic API.

Run `riw help` to show the available commands and options.

### Programmatic API

::TODO::
... two types of builds


## Contributing to riw

::TODO::

### Code of conduct

::TODO::


## Licence

::TODO::
