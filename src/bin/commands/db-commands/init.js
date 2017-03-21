// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import chalk from 'chalk';

import log from '../../../lib/log';
import type { RIW } from '../../..';
import { createHandlerWithRIW } from '../../utils';

export const command = 'init';
export const desc = 'Create an empty riw translations database in the configured location';

const here = `db ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}

        Creates an empty riw translations database.
    `);

export const handler = createHandlerWithRIW((riw: RIW) => {
    riw.db.init();

    log('Created empty riw database file ', chalk.bold(riw.config.translationsDatabaseFile));
    log('We recommend you check this file into git.');
});
