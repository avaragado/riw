// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import chalk from 'chalk';
import { bardot } from 'bardot';

import type { RIW, DBStatusResult } from '../../..';
import log from '../../../lib/log';
import { createHandlerWithRIW } from '../../utils';

export const command = 'status';
export const desc = 'Show information about translations in the database';

const here = `db ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}

        Shows information about default locale strings and their translations in the database.
    `)
    .options({
        missing: {
            alias: 'm',
            boolean: true,
            group: 'Command options',
            desc: outdent`
                Show missing translations, grouped by locale
            `,
        },
    });

const bold = x => chalk.bold(x);

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    let status: DBStatusResult;

    try {
        status = riw.db.status();

    } catch (err) {
        return;
    }

    if (status.default.length === 0) {
        log(outdent`
            Database is empty.
            Use ${chalk.bold('riw db update')} or ${chalk.bold('riw db import')} to add entries.
        `);

        return;
    }

    const arlid = Object.keys(status.locale).sort(
        (lid1, lid2) => status.locale[lid2].has.length - status.locale[lid1].has.length,
    );
    const ctCharMax = Math.max.apply(null, arlid.map(lid => lid.length));
    const bar = bardot
        .widthFill(ctCharMax + 4) // leave room for '- ', padded locale, '  '
        .maximum(status.default.length);

    const summary = lid => `- ${chalk.bold(lid.padEnd(ctCharMax + 2))}${bar.current(status.locale[lid].has.length).toString()}`;

    const missingPair = pair => `  - ${chalk.bold.blue(pair[0])} ${chalk.dim(pair[1])}`;

    const missing = lid => outdent`
        - ${chalk.bold(lid)} [${status.locale[lid].missing.length}]
        ${status.locale[lid].missing.map(missingPair).join('\n')}

    `;

    const hasMissing = lid => status.locale[lid].missing.length > 0;

    log(outdent`

        Database contains:
        - ${chalk.bold(status.default.length.toString())} distinct message/description pairs
        - ${chalk.bold(arlid.length.toString())} locales with translations – ${arlid.map(bold).join(', ')}

        Locale summary:
        ${arlid.map(summary).join('\n')}

    `);

    if (argv.missing) {
        const arlidMissing = arlid.filter(hasMissing);

        if (arlidMissing.length > 0) {
            log(outdent`
                Missing translations:
                ${arlidMissing.map(missing).join('\n')}

            `);
        } else {
            log(outdent`
                🎉  There are no missing translations.

            `);
        }
    }
});
