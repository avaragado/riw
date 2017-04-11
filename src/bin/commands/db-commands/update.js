// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import pick from 'ramda/src/pick';

import type { RIW, DBUpdateSpec } from '../../..';
import { createHandlerWithRIW } from '../../utils';

export const command = 'update';
export const desc = 'Add or edit a translation in the riw database';

const here = `db ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}
            --defaultMessage <sourceString> [--description <description>]
            --locale <localeID> --translation <localeString>

        Update the translation for <sourceString> (optionally disambiguated by <description>)
        in the default locale to <localeString> in the <localeID> locale.
    `)
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Hello {name}"
                --locale fr-FR
                --translation "Bonjour {name}"

        `,
        'Update the fr-FR translation for a welcome message.',
    )
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Export"
                --description "The button a user presses to start exporting data"
                --locale fr-FR
                --translation "Exporter"

        `,
        'Update the fr-FR translation for a button, with a description to disambiguate meaning.',
    )
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Export"
                --description "The section heading describing an export"
                --locale fr-FR
                --translation "Exportation"

        `,
        'Update the fr-FR translation for a label, with a description to disambiguate meaning.',
    )
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Hello"
                --description 'JSON:{"property": "value", "property2": 123}'
                --locale pt-BR
                --translation "Olá"
        `,
        'Update a pt-BR translation, using an object description expressed as a JSON string.',
    )
    .options({
        defaultMessage: {
            alias: 'm',
            string: true,
            demandOption: true,
            group: 'Command options',
            desc: outdent`
                The string that's being translated, in the default locale.
            `,
        },

        description: {
            alias: 'd',
            string: true,
            group: 'Command options',
            desc: outdent`
                The description for the string being translated.
                Required IF you use the 'description' field in react-intl message descriptors,
                AND if you use the same 'defaultMessage' in several places,
                AND you need different translations for these identical defaultMessages.
                If this has the prefix "JSON:", the remainder is parsed as JSON. Otherwise it's left as-is.
            `,
            coerce: (arg: string) => (arg.startsWith('JSON:') ? JSON.parse(arg.slice(5)) : arg),
        },

        locale: {
            alias: 'l',
            string: true,
            demandOption: true,
            group: 'Command options',
            desc: outdent`
                The locale ID of the translated string.
            `,
        },

        translation: {
            alias: 't',
            string: true,
            demandOption: true,
            group: 'Command options',
            desc: outdent`
                The translated string.
            `,
        },
    });

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    const opt: DBUpdateSpec = {
        translations: [
            pick(['defaultMessage', 'description', 'locale', 'translation'], argv),
        ],
    };

    try {
        riw.db.update(opt);

    } catch (err) {
        // ignore
    }
});
