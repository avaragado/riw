// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import chalk from 'chalk';
import pick from 'ramda/src/pick';

import { createHandlerWithRIW } from '../../utils';

export const command = 'find';
export const desc = 'Find translation database entries matching options';

const here = `db ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}
            [--defaultMessage <sourceString>]
            [--description <description>]
            [--locale <localeID]
            [--translation <localeString>]
            [--json]

        Outputs translation database entries matching all of the options supplied.
        Omitted options match any value.

        Each database entry comprises the string in the default locale, the description
        for that string, the locale of the translated string, and the translated string itself.
    `)
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Hello {name}"

        `,
        'Finds all database entries for the defaultMessage "Hello {name}", and outputs in readable form',
    )
    .example(
        outdent`
            $0 ${here}
                --locale fr-fr
                --json

        `,
        'Finds all database entries for translations into fr-fr, and outputs as JSON',
    )
    .example(
        outdent`
            $0 ${here}
                --description _
                --locale pt-br

        `,
        'Finds all database entries for translations into pt-br with the default description, _, and outputs in readable form',
    )
    .options({
        defaultMessage: {
            alias: 'm',
            string: true,
            group: 'Command options',
            desc: outdent`
                Output entries matching the string being translated.
                Omit to match any string.
            `,
        },

        description: {
            alias: 'd',
            string: true,
            group: 'Command options',
            desc: outdent`
                Output entries with this description.
                Omit to match any description.
            `,
        },

        locale: {
            alias: 'l',
            string: true,
            group: 'Command options',
            desc: outdent`
                Output entries with this locale.
                Omit to match any locale.
            `,
        },

        translation: {
            alias: 't',
            string: true,
            group: 'Command options',
            desc: outdent`
                Output entries with this translated string.
                Omit to match any translated string.
            `,
        },

        json: {
            boolean: true,
            group: 'Command options',
            desc: outdent`
                Output entries in JSON format as an array of
                { defaultMessage, ?description, locale, translation } objects.
                Omit to output in human-readable form.
            `,
        },
    });

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    const opt: RIWCLIOptDBFind = {
        match: pick(['defaultMessage', 'description', 'locale', 'translation'], argv),
    };

    const armdt = riw.db.find(opt);

    if (argv.json) {
        console.log(JSON.stringify(armdt, null, 4));

    } else {
        if (armdt.length > 0) {
            console.log(
                chalk.bold('Matches [%d]:\n'),
                armdt.length,
            );
        } else {
            console.log(
                chalk.bold('No matches'),
            );
        }

        armdt.forEach((mdt) => {
            console.log(
                ' -',
                chalk.bold.blue(mdt.defaultMessage),
                chalk.dim(mdt.description || ''),
                '\n',
                ' ',
                chalk.green(mdt.locale),
                chalk.bold.green(mdt.translation),
                '\n',
            );
        });
    }

});
