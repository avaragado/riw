#!/usr/bin/env node
// @flow

import 'babel-polyfill';
import yargs from 'yargs';
import outdent from 'outdent';

import { fabsConfigPackageForCWD } from '../lib/config';

// if config not specified, need to see if we can find an enclosing package.
const optsExtra = {};

// can't access yargs.argv here, as this (with yargs v9) breaks the yargs usage
// that comes afterwards. using yargs.argv here then doing yargs.reset()
// afterwards doesn't fix it. i tried the yargs check method, but that runs only
// when yargs feels like it should, rather than in all circumstances, so we
// can't use that to inspect arguments reliably either. back to basics...
if (process.argv.indexOf('config') === -1 && process.argv.indexOf('c') === -1) {
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
    })
    .argv;
