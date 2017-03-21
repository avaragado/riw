// @flow

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import mkdirp from 'mkdirp';

import type { AbsolutePath, LocaleId } from '../../../../types';
import log from '../../../log';
import type { OutputMode, Config } from '../../../config';
import { translationsOutputFile } from '../../../config-helper';

import type { TranslationLookupResult } from './findTranslations';

type Notifier = (name: string) => (fabs: AbsolutePath) => AbsolutePath;
type Writer = (
    config: Config,
    notify: Notifier,
    tof: {
        fromLid: (lid: LocaleId) => AbsolutePath,
        forSingleFile: () => AbsolutePath,
    },
    translation: TranslationLookupResult,
) => void;

type WriterMap = { [key: OutputMode]: Writer };

const stringify = obj => JSON.stringify(obj, null, 4);

const arlidInclude = (config: Config): LocaleId[] =>
    config.targetLocales.concat(config.defaultLocale);

const arWriterByMode: WriterMap = {
    'file-per-locale': (config, notify, tof, translation) => {
        arlidInclude(config).forEach((lid) => {
            const json = stringify(translation.locale[lid] || {});
            const fabs = tof.fromLid(lid);

            fs.writeFileSync(fabs, json);
            notify('fileSaved')(fabs);
        });
    },

    'single-file': (config, notify, tof, translation) => {
        const data = arlidInclude(config).reduce(
            (dataAcc, lid) => {
                dataAcc[lid] = translation.locale[lid] || {};
                return dataAcc;
            },
            {},
        );

        const json = stringify(data);
        const fabs = tof.forSingleFile();

        fs.writeFileSync(fabs, json);
        notify('fileSaved')(fabs);
    },

    'no-file': () => {},
};

export default (config: Config, notify: Notifier) =>
    (translation: TranslationLookupResult) => {
        const tof = translationsOutputFile(config);
        const { translationsOutputFile: pathOut } = config;

        if (!tof.hasPlaceholder()) {
            log.error('The ', chalk.bold(tof.sPlaceholder), ' placeholder is missing from your ', chalk.bold('translationsOutputFile'), ' setting.');
            log.error('Current setting: ', chalk.bold(pathOut));

            throw new Error(`Configuration error: translationsOutputFile needs "${tof.sPlaceholder}`);
        }

        const dabsOut = path.dirname(tof.forSingleFile());

        try {
            mkdirp.sync(dabsOut);

        } catch (err) {
            log.error('Unable to create directory ', chalk.bold(dabsOut), ' for riw translation file(s).');
            throw err;
        }

        arWriterByMode[config.outputMode](config, notify, tof, translation);

        return translation;
    };
