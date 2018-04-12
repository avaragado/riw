// @flow

import path from 'path';

import type yargs from 'yargs';

import outdent from 'outdent';
import ora from 'ora';
import chalk from 'chalk';
import { bardot } from 'bardot';

import type { AbsolutePath, MessageDescriptorWithFile } from '../../../types';
import type { RIW, Config, AppTranslateSpec, TranslationLookupResult, DuplicateIdData } from '../../..';
import log from '../../../lib/log';
import { createHandlerWithRIW } from '../../utils';

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
    `)
    .options({
        quiet: {
            alias: 'q',
            boolean: true,
            group: 'Command options',
            desc: outdent`
                Output nothing
            `,
        },
    });

const sfrelFromFabsFromConfig = (config: Config) => (fabs: AbsolutePath) =>
    chalk.green(path.relative(config.rootDir, fabs));

const squashToLength = (ctCharMax: number) => (str: string) => (
    str.length > ctCharMax
        ? `${str.slice(0, (ctCharMax / 2) - 3)}...${str.slice(-ctCharMax / 2)}`
        : str
);

const makeAppTranslateSpec: (RIW, boolean) => AppTranslateSpec = (riw, quiet) => {
    if (quiet) {
        return {};
    }

    // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
    const ctCharLine = process.stdout.columns;
    const sfrelFromFabs = sfrelFromFabsFromConfig(riw.config);
    const squash = squashToLength(ctCharLine / 2);

    const spinner = ora();
    let ctFile;
    let numFile = 0;
    let ctMD = 0;
    let bar = bardot.widthBar((ctCharLine / 2) - 10); // leave room for ctMD

    return {
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
                bar = bar.maximum(ctFile);
                spinner.text = `Processing ${ctFile} files...`;
            },
            startExtractFile: (fabs) => {
                numFile += 1;
                spinner.text = `${bar.current(numFile).toString()} [${ctMD}] ${squash(sfrelFromFabs(fabs))}`;
            },
            endExtractFile: ({ armd, fabs }) => {
                ctMD += armd.length;
                spinner.text = `${bar.current(numFile).toString()} [${ctMD}] ${squash(sfrelFromFabs(fabs))}`;
                spinner.render();
            },
            endExtract: (armd: MessageDescriptorWithFile[]) => {
                spinner.succeed(`Found ${chalk.bold(
                    armd.length.toString(),
                    'message descriptors',
                )} from ${chalk.bold(
                    numFile.toString(),
                    'files',
                )}`);
            },
            startDupCheck: () => {
                spinner.text = 'Checking for duplicate message descriptor ids...';
                spinner.start();
            },
            endDupCheck: (dups: DuplicateIdData[]) => {
                if (dups.length) {
                    spinner.fail(`Duplicate message descriptor ids (${dups.length}):`);
                    log(dups.map(dup => outdent`
                        ${outdent}
                            - ${chalk.red.bold(dup.id)} used in:
                            ${dup.files.map(sfrelFromFabs).join('\n    ')}
                    `).join('\n'));

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
};

export const handler = createHandlerWithRIW((riw: RIW, argv: yargs.Argv) => {
    const opt = makeAppTranslateSpec(riw, argv.quiet);

    try {
        riw.app.translate(opt);

    } catch (err) {
        // ignore;
    }
});
