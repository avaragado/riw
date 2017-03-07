// @flow

import fs from 'fs';

import type yargs from 'yargs';

import outdent from 'outdent';
import compose from 'ramda/src/compose';
import chain from 'ramda/src/chain';
import map from 'ramda/src/map';
import pick from 'ramda/src/pick';
import reject from 'ramda/src/reject';

import { createHandlerWithRIW } from '../../utils';

const cmd = 'import';

export const command = `${cmd} <file...>`;
export const desc = 'Update translations in the riw database in bulk';

const here = `db ${cmd}`;

const isValid = tr => tr.defaultMessage && tr.locale && tr.translation;
const stringify = obj => JSON.stringify(obj, null, 4);

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here} <file.json>...

        Updates the translations database with the contents of each <file.json>.
        Each file must be in JSON format, and must consist of an array of objects.
        Each object has these keys:

        - "defaultMessage"   Mandatory. The string in the default locale.
        - "description"   Optional. The description for the string.
        - "locale"   Mandatory. The locale for the translation.
        - "translation"   Mandatory. The defaultMessage, translated to the locale.

        Any other keys are ignored.

        The "defaultMessage" and "description" properties identify the string being translated.
        They must be exactly as in the "todo" file of untranslated messages output by the
        "riw project translate" command.
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
    .coerce('file', chain(compose(
        JSON.parse,
        fs.readFileSync,
    )))
    .check((argv: yargs.Argv) => {
        const arInvalid = reject(isValid, argv.file);

        if (arInvalid.length) {
            throw new Error(outdent`
                Import failed (database is unchanged)

                Input objects must have keys "defaultMessage", "locale" AND "translation".
                These objects are invalid:
                ${arInvalid.map(stringify).join(',\n')}
            `);
        }

        return true;
    });

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    const opt: RIWCLIOptDBUpdate = {
        translations: map(
            pick(['defaultMessage', 'description', 'locale', 'translation']),
            argv.file,
        ),
    };

    riw.db.update(opt);
});
