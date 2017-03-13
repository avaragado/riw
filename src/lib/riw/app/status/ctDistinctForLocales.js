// @flow

import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import zipObj from 'ramda/src/zipObj';
import pathOr from 'ramda/src/pathOr';
import repeat from 'ramda/src/repeat';

import { translationsOutputFile } from '../../../config-helper';

import loadJSONOrNull from './loadJSONOrNull';

type Reader = (config: RIWConfig) => {
    default: ?number,
    target: {
        [key: LocaleId]: ?number,
    },
};

type ReaderMap = { [key: OutputMode]: Reader };

const ctKeyOrNull = (obj: ?Object): ?number => (
    obj ? Object.keys(obj).length : null
);

const readerByMode: ReaderMap = {
    'file-per-locale': config => compose(
        tof => map(
            compose(ctKeyOrNull, loadJSONOrNull, tof.fromLid),
            [config.defaultLocale, ...config.targetLocales],
        ),
        () => translationsOutputFile(config),
    )(),

    'single-file': config => compose(
        map(ctKeyOrNull),
        obj => map(
            lid => pathOr(null, [lid], obj),
            [config.defaultLocale, ...config.targetLocales],
        ),
        loadJSONOrNull,
        () => translationsOutputFile(config).forSingleFile(),
    )(),

    'no-file': config => repeat(null, config.targetLocales.length + 1),
};

const reader: Reader = config => compose(
    ([ctDefault, ...arctTarget]) => ({
        default: ctDefault,
        target: zipObj(config.targetLocales, arctTarget),
    }),
    rdr => rdr(config),
    () => readerByMode[config.outputMode],
)();

export default reader;
