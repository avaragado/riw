// @flow

import type yargs from 'yargs';

import outdent from 'outdent';

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

    log.info('riw', `Created empty riw database file ${riw.config.translationsDatabaseFile}.`);
    log.info('riw', 'We recommend you check this file into git.');
});
