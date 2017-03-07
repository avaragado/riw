// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import chalk from 'chalk';
import pick from 'ramda/src/pick';

import { createHandlerWithRIW } from '../../utils';

export const command = 'delete';
export const desc = 'Delete translation database entries matching options';

const here = `db ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}
            [--defaultMessage <sourceString>]
            [--description <description>]
            [--locale <localeID]
            [--translation <localeString>]
            [--dry-run]

        Deletes translation database entries matching all of the options supplied.
        Omitted options match any value.

        At least one of --defaultMessage, --description, --locale and --translation
        must be supplied.

        Use --dry-run to show what would be deleted instead of deleting it.
    `)
    .example(
        outdent`
            $0 ${here}
                --defaultMessage "Hello {name}"

        `,
        'Deletes all database entries for the defaultMessage "Hello {name}"',
    )
    .example(
        outdent`
            $0 ${here}
                --locale fr-fr

        `,
        'Deletes all database entries for translations into fr-fr',
    )
    .options({
        'defaultMessage': {
            alias: 'm',
            string: true,
            group: 'Command options',
            desc: outdent`
                Delete entries matching the string being translated.
                Omit to match any string.
            `,
        },

        'description': {
            alias: 'd',
            string: true,
            group: 'Command options',
            desc: outdent`
                Delete entries with this description.
                Omit to match any description.
            `,
        },

        'locale': {
            alias: 'l',
            string: true,
            group: 'Command options',
            desc: outdent`
                Delete entries with this locale.
                Omit to match any locale.
            `,
        },

        'translation': {
            alias: 't',
            string: true,
            group: 'Command options',
            desc: outdent`
                Delete entries with this translated string.
                Omit to match any translated string.
            `,
        },

        'dry-run': {
            alias: 'n',
            boolean: true,
            group: 'Command options',
            desc: outdent`
                Show what would be deleted without deleting anything.
            `,
        },
    });

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    if (!(argv.defaultMessage || argv.description || argv.locale || argv.translation)) {
        console.log('You must supply an option.');
        process.exit();
    }

    const opt: RIWCLIOptDBDelete = {
        match: pick(['defaultMessage', 'description', 'locale', 'translation'], argv),
    };

    if (argv.dryRun) {
        const armdt = riw.db.find(opt);

        if (armdt.length > 0) {
            console.log(
                chalk.bold('To be deleted [%d]:\n'),
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

    } else {
        riw.db.delete(opt);
    }
});
