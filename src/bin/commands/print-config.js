// @flow

import type yargs from 'yargs';

import { configFromOptionalPath } from '../../lib/config';

export const command = 'print-config';
export const desc = 'Output the configuration used, in JSON format, taking defaults into account';

export const handler = (argv: yargs.Argv) => {
    const config = configFromOptionalPath(argv.config);

    // this uses plain config.log to make it easier to copy.
    console.log(JSON.stringify(config, null, 4));
};
