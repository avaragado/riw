// @flow

import type yargs from 'yargs';

export const command = 'init-db';
export const desc = 'Initialise riw translations database according to configuration';

export const handler = (argv: yargs.Argv) => {
    console.log('init-db', argv);

    console.log('argv.config', argv.config);
};
