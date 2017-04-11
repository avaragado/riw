# FAQ/troubleshooting

## I get "unexpected token" and a stack trace when I run `riw app translate`

This might indicate your app doesn't have a `.babelrc` file appropriate to your source files. This can happen if you put all your configuration for babel inside your webpack `babel-loader` configuration.

riw runs babel itself, to extract your `react-intl` message descriptors, but relies on your app's own babel configuration for the additional presets and plugins your app requires.

To fix:

- **Either** add a simple `.babelrc` file appropriate for your source files
- **Or** set up your webpack configuration to use `babel-plugin-react-intl`, and configure riw to pick up your message descriptors from the JSON files output by this plugin. See the `inputMode` setting in [riw configuration](./config.md). In this case you need to create a build in your usual way, using webpack, before running `riw app translate`.


## I've made the tiniest change to a default message or a description and the translation is lost!

It's not lost: it's still in the translations database. But `riw app translate` looks in that database for identical matches only. riw must work this way as the tiniest change to a default message or a description likely invalidates the translation of that message. It's better for an app to fall back to the message in the default locale than to show a translation that might be out of date in a potentially confusing or dangerous way.

If you know the default message or description has changed in a way that doesn't affect the translation – for example, if you've changed the name of an argument in braces, or just fixed a typo in a description – then you can edit the database manually (it's just a JSON file). Be sure to rename any changed argument for all locales.


## Should I use descriptions or not?

In `react-intl`, descriptions in message descriptors are optional. This means they're optional with riw too.

The goal of a description is to give context to a translator. In many cases this is unnecessary. For example, with a message "Are you sure you want to delete the image?" a translator might not need any additional context.

Context is more important with short messages, especially where words in the default locale act as both verbs and nouns, for example. Also, where messages include arguments in braces, it's often helpful to explain what the argument represents.

Example: the word "Email" is used in en-GB in multiple ways:

- noun: A single email, as in "I've sent you an email"
- noun: Multiple emails, as in "I have too much email".
- noun: An email mailbox or email client, as in "Look in your email"
- noun: An email address, as in "What's your email?"
- verb: To send email, as in "Email me".

If you ask a translator to translate the string "Email", which sense do you mean? Without context, the translator must guess. Don't assume that the translation for one sense can be reused for all other senses, in all other locales you support.

If there is any chance of ambiguity, add a description.


## Can I use objects as descriptions in message descriptors, as `react-intl` allows this?

Yes. You can use either strings or arbitrary objects as the value of the optional `description` property in your message descriptors.

Description objects are included unchanged in the TODO file riw generates for messages requiring translation. `riw db import` accepts description objects in the input files.

As with description strings, if a description object in your code changes in any way – a new, removed or changed property – then `riw app translate` might not find a translation in the riw translations database. See "I've made the tiniest change..." above.

In the riw translations database description objects are serialised to JSON strings, as they're used as keys in this data structure. The JSON serialisation should be stable across platforms: there's no unnecessary spacing and keys are ordered alphabetically. If you edit the JSON file manually, be sure to preserve these features.

All `riw db` commands work with description objects: to specify an object on the command line, encode it as valid JSON and add the prefix "JSON:" (with the colon). You don't need to match the database representation character for character: it's automatically normalised. For example, here are two equivalent ways to list all messages where the description is an object with the two specified properties exactly (partial matches are not supported):

```bash
$ riw db list --description 'JSON:{"my_prop": "foo", "another_prop": 123}'
$ riw db list --description 'JSON:{"another_prop":123,"my_prop":"foo"}' # same as above
```


## How do I ensure message descriptor ids are unique?

Each `react-intl` message descriptor must include an id that uniquely identifies the message within your app. It uses this id to identify which string to display. However, `react-intl` does not impose or recommend any naming scheme for ids. riw helps by pointing out, as part of the output of `riw app translate`, if you've used the same id more than once.

You might want to use a naming scheme to make it easy to select unique ids.

`react-intl` and riw treat ids as completely opaque: you're free to use whichever naming scheme makes sense for your app. One possible naming scheme is based on the component's location in your repository. For example, you might have a repository that looks like this (ignoring irrelevant files):

```
src
├── route1
│   └── components
│       ├── MyComponent1.js
│       └── MyComponent2.js
├── route2
│   └── components
│       └── MyComponent1.js
└── route3
    └── components
        ├── MyComponent1.js
        ├── MyComponent2.js
        └── MyComponent3.js
```

Your id algorithm could be:

1. Take the path to the component file within the repository. For example, `src/route2/components/MyComponent1.js`.
1. Remove the `src/` prefix and `.js` suffix: `route2/components/MyComponent1`
1. Add a suffix, unique within the component, for each string used by the component: `route2/components/MyComponent1/title`, `route2/components/MyComponent1/button/cancel`, `route2/components/MyComponent1/button/ok`, and so on.

Translation services typically also require or allow you to supply an id with each string that needs translation. This is another way to include some context with a string to help translators understand its usage. For example, the ids used above include `button` to indicate the string corresponds to a button label (and these are almost always verbs).


## How do I check the translations returned by a translator/translation service?

Translations need two kinds of checks: **sanity** checks and **quality** checks.

Only a native speaker of the language – who should be someone other than the translator – can perform a reliable quality check. With some translation services you can request a quality check as part of the process. If you don't do this, and don't include your own quality check as part of your integration process for newly translated strings, then you're forcing your users and potential users to check the quality of your translations, and you're relying on them to report any issues.

In contrast, careful developers can perform sanity checks of translations even if they don't understand the language. Here's a rough checklist:

- Check for "translations" that are just the default message copied and pasted. This might indicate the translator couldn't understand the default message – or it might be the appropriate translation for that locale. Consider querying these with the translation service (in particular, you may have paid for this non-translation).
- Check for broken HTML entities. For example, you might see `& mdash;` or `&mdash` instead of `&mdash;`. You can fix these with care.
- Check for broken HTML tags. For example, you might see `<ahref="...">`. You can fix these safely, but make sure you only change content inside the tags: between the `<` and the next `>`.
- Check for unexpected newlines. For example, you might see a CR or LF in a translation where the default message had no such character. The presence of these might not matter – it depends on the usage – but it might indicate the translator struggled with the translation. Consider removing these rogue characters or replacing with spaces.
- Check for translation or mangling of your product name. Typically you won't want to translate a product name, but translators often don't realise this or don't recognise your product name. In some cases you might by contrast _require_ a localised product name (for example, for legal reasons).
- Check for mangled arguments. For example, where the default message `Hello { name }!` has become `Bonjour name!` or `Bonjour { name }}!`. You can fix these with care.
- Check for translated arguments. For example, where the default message `Hello { name }!` has become `Bonjour { nom }!`. You can fix these with care.
- Check for proper formatting of more complex ICU Message syntax. For example, where the default message `{numFiles, plural, one {one file} other {# files}}` has become something like `{numFiles, Plural, ein {eine Datei} andere {# Dateien}}` (too many parts translated) or `{numFiles, plural, um {one file} outros {# files}}` (the wrong parts translated). This indicates the translator doesn't understand ICU Message syntax. You can fix the "too many parts translated" case, with care, but can't fix the "wrong parts translated" case: query these with the translation service.


## What happens with branching and merging?

You can continue to use riw on branched code. riw doesn't hold any internal persistent state that might send it wonky on branches. There might conceivably be issues if different versions of riw are used on different branches.

riw needs to be able to read its configuration, your `react-intl` message descriptors, and its translations database, and it needs to be able to write to its translations database and its output files: as long as this is all possible, riw is happy.

When you merge two branches, you may see conflicts as usual.

- Conflicts inside the riw translations database: you need to fix these manually. It's just a JSON file.
- Conflicts inside the riw configuration: you need to fix these manually. In `package.json` this is simple JSON. Elsewhere, it's JavaScript exporting an object.
- Conflicts inside the riw output files: ignore these, and run `riw app translate` once conflicts elsewhere are resolved.

