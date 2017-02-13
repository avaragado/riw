// @flow

import compose from 'ramda/src/compose';

import readDB from './persistence/readDB';
import writeDB from './persistence/writeDB';

export default (transform: RIWDBTransformer, config: RIWConfig) => (opt?: Object) => compose(
    writeDB(config),
    transform(config, opt),
    readDB(config),
)();
