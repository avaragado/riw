// @flow

import compose from 'ramda/src/compose';

import readDB from './readDB';
import toQuads from './toQuads';
import writeDB from './writeDB';
import fromQuads from './fromQuads';

export const makeDiskRWPipeline = (transform: RIWDBQuadsTransformer, config: RIWConfig) =>
    (opt?: Object) => compose(
        writeDB(config),
        fromQuads(config),
        transform(config, opt),
        toQuads(config),
        readDB(config),
    )();

export const makeDiskToQuadsPipeline = (transform: RIWDBQuadsTransformer, config: RIWConfig) =>
    (opt?: Object): RIWDBQuad[] => compose(
        transform(config, opt),
        toQuads(config),
        readDB(config),
    )();
