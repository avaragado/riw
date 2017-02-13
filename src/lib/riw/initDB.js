// @flow

import compose from 'ramda/src/compose';

import rdbEmpty from './rdbEmpty';
import writeDB from './persistence/writeDB';

export default (config: RIWConfig) => compose(
    writeDB(config, { allowOverwrite: false }),
    rdbEmpty(config),
);
