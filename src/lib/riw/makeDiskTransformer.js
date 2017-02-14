// @flow

import compose from 'ramda/src/compose';

import readDB from './persistence/readDB';
import toQuads from './persistence/toQuads';
import writeDB from './persistence/writeDB';
import fromQuads from './persistence/fromQuads';

export default (transform: RIWDBQuadsTransformer, config: RIWConfig) => (opt?: Object) => compose(
    writeDB(config),
    fromQuads(config),
    transform(config, opt),
    toQuads(config),
    readDB(config),
)();
