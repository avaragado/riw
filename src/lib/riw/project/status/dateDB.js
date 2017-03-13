// @flow

import path from 'path';

import compose from 'ramda/src/compose';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: RIWConfig) => {
    dateDB: number,
};

const result: Result = compose(
    dateDB => ({ dateDB }),
    dateMTimeFromFabs,
    (config: RIWConfig) => path.resolve(
        config.rootDir,
        config.translationsDatabaseFile,
    ),
);

export default result;
