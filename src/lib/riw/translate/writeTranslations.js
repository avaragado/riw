// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import log from '../../../lib/log';

type Writer = (
    config: RIWConfig,
    notify: string => string => string,
    translation: RIWFindTranslationResult,
    fabsOut: AbsolutePath,
) => void;

type WriterMap = { [key: OutputMode]: Writer };

const rePH = /\[locale\]/g;
const sPH = '[locale]';
const sSingle = 'locales';

const stringify = obj => JSON.stringify(obj, null, 4);

const arlidInclude = (config: RIWConfig): LocaleId[] =>
    config.targetLocales.concat(config.defaultLocale);

const arWriterByMode: WriterMap = {
    'file-per-locale': (config, notify, translation, fabsOut) => {
        arlidInclude(config).forEach((lid) => {
            const json = stringify(translation.locale[lid] || {});
            const fabs = fabsOut.replace(rePH, lid);

            fs.writeFileSync(fabs, json);
            notify('fileSaved')(fabs);
        });
    },

    'single-file': (config, notify, translation, fabsOut) => {
        const data = arlidInclude(config).reduce(
            (dataAcc, lid) => {
                dataAcc[lid] = translation.locale[lid] || {};
                return dataAcc;
            },
            {},
        );

        const json = stringify(data);
        const fabs = fabsOut.replace(rePH, sSingle);

        fs.writeFileSync(fabs, json);
        notify('fileSaved')(fabs);
    },

    'no-file': () => {},
};

export default (config: RIWConfig, notify: string => string => string) =>
    (translation: RIWFindTranslationResult) => {
        const { translationsOutputFile: pathOut, rootDir } = config;

        if (!pathOut.match(rePH)) {
            log.error('riw', `Include "${sPH}]" somewhere in your translationsOutputFile setting.`);
            log.error('riw', `Current translationsOutputFile setting: ${pathOut}`);

            throw new Error(`Configuration error: translationsOutputFile needs "${sPH}"`);
        }

        const fabsOut = path.resolve(rootDir || process.cwd(), pathOut);
        const dabsOut = path.dirname(fabsOut);

        try {
            mkdirp.sync(dabsOut);
        } catch (err) {
            log.error('riw', `Unable to create directory ${dabsOut} for riw translations file(s).`);
            throw err;
        }

        arWriterByMode[config.outputMode](config, notify, translation, fabsOut);

        return translation;
    };
