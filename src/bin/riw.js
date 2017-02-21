#!/usr/bin/env node
// @flow

import 'babel-polyfill';
import yargs from 'yargs';
import outdent from 'outdent';

import log from '../lib/log';
import { fabsConfigPackageForCWD } from '../lib/config';

// need to do this early so the function calls below honour it.
if (yargs.argv.verbose) {
    log.level = 'verbose';
}

// if config not specified, need to see if we can find an enclosing package.
const optsExtra = {};

if (!yargs.argv.config) {
    const fabsConfigPackage = fabsConfigPackageForCWD();

    if (fabsConfigPackage === null) {
        optsExtra.demandOption = outdent`

            Can't find a package.json in the ancestry of the current directory.
            Either cd inside an npm package and redo the command, or use the --config option.
        `;
    }
}

yargs // eslint-disable-line no-unused-expressions
    .commandDir('commands')
    .demandCommand(1, 'Please supply a command.')
    .help()
    .wrap(yargs.terminalWidth())
    .strict()
    .options({
        'config': {
            alias: 'c',
            global: true,
            string: true,
            nargs: 1,
            desc: outdent`
                Configuration filename (absolute, or relative to current dir).
                Omit to use .riw-config.js in package root, or package.json key "riw".
            `,
            ...optsExtra,
        },
        'verbose': {
            global: true,
            boolean: true,
            desc: outdent`
                Show more detailed output.
            `,
        },
    })
    .argv;

