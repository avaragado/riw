// @flow

import path from 'path';

import type yargs from 'yargs';

import outdent from 'outdent';
import ora from 'ora';
import chalk from 'chalk';

import { createHandlerWithRIW, createBar } from '../../utils';

export const command = 'extract';
export const desc = 'Extract react-intl message descriptors from your project components';

const here = `project ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}

        Extracts all react-intl message descriptors from your project components.
        This uses babel-plugin-react-intl.

        !!!::TODO:: more info here, including use of config options

        also: uses the same babel options that would apply in your project,
        via .babelrc or babel settings in package.json. if you build using webpack (eg)
        that lets you plug in additional config, it won't spot this.
    `);

const frelFromFabsFromConfig = (config: RIWConfig) => (fabs: AbsolutePath) =>
    chalk.green(path.relative(config.rootDir || '.', fabs));

export const handler = createHandlerWithRIW((riw: RIW) => {
    const frelFromFabs = frelFromFabsFromConfig(riw.config);

    const spinner = ora();
    let ctFile;
    let numFile = 0;
    let ctMD = 0;
    let bar;

    const opt: RIWCLIOptProjectExtract = {
        on: {
            start: () => {
                spinner.text = 'Finding source files...';
                spinner.start();
            },
            startFiles: (arfabs) => {
                ctFile = arfabs.length;
                bar = createBar(ctFile);
                spinner.text = `Processing ${ctFile} files...`;
            },
            startFile: (fabs) => {
                numFile += 1;
                spinner.text = `${bar(numFile)} [${ctMD}] ${frelFromFabs(fabs)}`;
            },
            endFile: (smdd: RIWSourceMessageDescriptorData) => {
                ctMD += smdd.armd.length;
                spinner.text = `${bar(numFile)} [${ctMD}] ${frelFromFabs(smdd.fabs)}`;
                spinner.render();
            },
            startDupCheck: () => {
                spinner.text = `${bar(numFile)} [${ctMD}] Checking for duplicate message descriptor ids...`;
                spinner.render();
            },
        },
    };

    const { armd, dups } = riw.project.extract(opt);

    spinner.succeed(`Found ${chalk.bold(ctMD.toString(), 'message descriptors')} from ${chalk.bold(numFile.toString(), 'files')}`);

    if (dups.length) {
        spinner.fail(`Duplicate message descriptor ids: ${dups.length}`);
        console.log(dups.map(
            dup => outdent`
              ${outdent}
                - ${chalk.blue(dup.id)} used in:
                  ${dup.arfabs.map(frelFromFabs).join('\n    ')}
            `,
        ).join('\n'));
    } else {
        spinner.succeed('No duplicate message descriptor ids');
    }

    // console.log('FINAL DATA:', armd, dups);
});
