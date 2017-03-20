// @flow

import path from 'path';

import compose from 'ramda/src/compose';

import type { Config } from '../../../config';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: Config) => {
    dateDB: number,
};

const result: Result = compose(
    dateDB => ({ dateDB }),
    dateMTimeFromFabs,
    (config: Config) => path.resolve(
        config.rootDir,
        config.translationsDatabaseFile,
    ),
);

export default result;
