// @flow

import path from 'path';

import type yargs from 'yargs';

import outdent from 'outdent';
import ora from 'ora';
import chalk from 'chalk';

import type { AbsolutePath, MessageDescriptorWithFile } from '../../../types';
import type { RIW, Config, AppTranslateSpec, TranslationLookupResult, DuplicateIdData } from '../../..';
import log from '../../../lib/log';
import { createHandlerWithRIW, createBar } from '../../utils';

export const command = 'translate';
export const desc = 'Generate JSON containing translations for the app';

const here = `app ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}

        Generates one or more JSON files containing translated strings for your app,
        and a JSON file containing the strings that still need translation.

        To generate this data riw combines your translation database with the
        react-intl message descriptors in your app.

        Your riw configuration settings determine how riw looks for message descriptors,
        and where the final files are saved. See configuration documentation for details.
    `);

const sfrelFromFabsFromConfig = (config: Config) => (fabs: AbsolutePath) =>
    chalk.green(path.relative(config.rootDir, fabs));

export const handler = createHandlerWithRIW((riw: RIW) => {
    const sfrelFromFabs = sfrelFromFabsFromConfig(riw.config);

    const spinner = ora();
    let ctFile;
    let numFile = 0;
    let ctMD = 0;
    let bar;

    const opt: AppTranslateSpec = {
        on: {
            start: () => {
                spinner.text = {
                    source: 'Finding component source files...',
                    json: 'Finding JSON message descriptor files...',
                }[riw.config.inputMode];

                spinner.start();
            },
            startExtract: (arfabs) => {
                ctFile = arfabs.length;
                bar = createBar(ctFile);
                spinner.text = `Processing ${ctFile} files...`;
            },
            startExtractFile: (fabs) => {
                numFile += 1;
                spinner.text = `${bar(numFile)} [${ctMD}] ${sfrelFromFabs(fabs)}`;
            },
            endExtractFile: ({ armd, fabs }) => {
                ctMD += armd.length;
                spinner.text = `${bar(numFile)} [${ctMD}] ${sfrelFromFabs(fabs)}`;
                spinner.render();
            },
            endExtract: (armd: MessageDescriptorWithFile[]) => {
                spinner.succeed(
                    `Found ${chalk.bold(
                        armd.length.toString(),
                        'message descriptors',
                    )} from ${chalk.bold(
                        numFile.toString(),
                        'files',
                    )}`,
                );
            },
            startDupCheck: () => {
                spinner.text = 'Checking for duplicate message descriptor ids...';
                spinner.start();
            },
            endDupCheck: (dups: DuplicateIdData[]) => {
                if (dups.length) {
                    spinner.fail(`Duplicate message descriptor ids (${dups.length}):`);
                    log(dups.map(
                        dup => outdent`
                            ${outdent}
                              - ${chalk.red.bold(dup.id)} used in:
                                ${dup.files.map(sfrelFromFabs).join('\n    ')}
                        `,
                    ).join('\n'));

                } else {
                    spinner.succeed('No duplicate message descriptor ids');
                }
            },
            startLookup: () => {
                spinner.text = 'Finding translations...';
                spinner.start();
            },
            endLookup: (translation: TranslationLookupResult) => {
                const { todos } = translation;

                if (riw.config.targetLocales.length === 0) {
                    spinner.fail('No translations: Define "targetLocales" in your riw configuration');

                } else if (todos.length) {
                    spinner.fail(`Missing translations: ${todos.length}`);

                } else {
                    spinner.succeed('All messages have translations for every locale');
                }
            },
            fileSaved: (fabs: AbsolutePath) => {
                spinner.succeed(`Saved ${fabs}`);
            },
            end: () => {
                spinner.stop();
            },
        },
    };

    try {
        riw.app.translate(opt);

    } catch (err) {
        // ignore;
    }
});
