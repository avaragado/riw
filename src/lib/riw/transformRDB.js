// @flow

import compose from 'ramda/src/compose';

import readRDB from './readRDB';
import writeRDB from './writeRDB';

export default (transformer: RIWDBTransformer) => (config: RIWConfig, opt?: Object) => compose(
    writeRDB(config),
    transformer(config, opt),
    readRDB(config),
);
