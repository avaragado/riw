// @flow

import compose from 'ramda/src/compose';

import rdbEmpty from '../util/rdbEmpty';
import writeDB from './writeDB';

export default (config: RIWConfig) => compose(
    writeDB(config, { allowOverwrite: false }),
    () => rdbEmpty,
);
