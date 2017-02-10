// @flow

import compose from 'ramda/src/compose';

import rdbEmpty from './rdbEmpty';
import writeRDB from './writeRDB';

export default (config: RIWConfig) => compose(
    writeRDB(config, { allowOverwrite: false }),
    rdbEmpty(config),
);
