// @flow

import fs from 'fs';

import type yargs from 'yargs';

import chalk from 'chalk';
import outdent from 'outdent';
import compose from 'ramda/src/compose';
import chain from 'ramda/src/chain';
import map from 'ramda/src/map';
import pick from 'ramda/src/pick';
import groupBy from 'ramda/src/groupBy';

import type { RIW, DBUpdateSpec } from '../../..';
import { createHandlerWithRIW } from '../../utils';

const cmd = 'import';

export const command = `${cmd} <file...>`;
export const desc = 'Update translations in the riw database in bulk';

const here = `db ${cmd}`;

const groupValidity = tr => (
    tr.defaultMessage && tr.locale && tr.translation
    ? 'valid'
    : 'invalid'
);

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here} <file.json>...

        Updates the translations database with the contents of each <file.json>.
        Each file must be in JSON format, and must consist of an array of objects.
        Each object should have these keys:

        - "defaultMessage"   Mandatory. The string in the default locale.
        - "description"   Optional. The description for the string.
        - "locale"   Mandatory. The locale for the translation.
        - "translation"   Mandatory. The defaultMessage, translated to the locale.

        Any other keys are ignored. Objects without all mandatory keys are ignored.

        The "defaultMessage" and "description" properties identify the string being translated.
        They must be exactly as in the TODO file of untranslated messages output by the
        "riw app translate" command.
    `)
    .example(
        outdent`
            $0 ${here} TODO-with-translations.json

        `,
        'Imports all translations from the file.',
    )
    .example(
        outdent`
            $0 ${here} foo.json bar.json

        `,
        'Imports all translations from each file in turn.',
    )
    .coerce('file', compose(
        groupBy(groupValidity),
        chain(compose(JSON.parse, fs.readFileSync)),
    ));

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    const { valid = [], invalid = [] } = argv.file;

    const opt: DBUpdateSpec = {
        translations: map(
            pick(['defaultMessage', 'description', 'locale', 'translation']),
            valid,
        ),
    };

    try {
        riw.db.update(opt);
        console.log(outdent`
            - Imported ${chalk.bold(valid.length.toString())} translation(s).
            - Ignored ${chalk.bold(invalid.length.toString())} object(s) missing required keys.
        `);

    } catch (err) {
        // ignore;
    }
});
