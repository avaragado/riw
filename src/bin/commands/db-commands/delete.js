// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import chalk from 'chalk';
import pick from 'ramda/src/pick';

import type { RIW, DBListSpec } from '../../..';
import log from '../../../lib/log';
import { createHandlerWithRIW, prettifyMdtAr } from '../../utils';

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
        log.error('You must supply an option.');
        process.exit();
    }

    const opt: DBListSpec = {
        match: pick(['defaultMessage', 'description', 'locale', 'translation'], argv),
    };

    if (argv.dryRun) {
        let armdt;

        try {
            armdt = riw.db.list(opt);

        } catch (err) {
            return;
        }

        if (armdt.length > 0) {
            log(chalk.bold(`To be deleted [${armdt.length.toString()}]:\n`));
            log(prettifyMdtAr(armdt));

        } else {
            log(chalk.bold('No matches'));
        }

    } else {
        try {
            riw.db.delete(opt);

        } catch (err) {
            // ignore;
        }
    }
});
