// @flow

import compose from 'ramda/src/compose';

import readFromFile from './readFromFile';
import writeToFile from './writeToFile';
import arquadFromDB from './arquadFromDB';
import dbFromQuadAr from './dbFromQuadAr';

export const makeFileToFilePipeline = (transform: RIWDBQuadsTransformer, config: RIWConfig) =>
    (opt?: Object) => compose(
        writeToFile(config),
        dbFromQuadAr,
        transform(config, opt),
        arquadFromDB,
        readFromFile(config),
    )();

export const makeFileToQuadArPipeline = (transform: RIWDBQuadsTransformer, config: RIWConfig) =>
    (opt?: Object): RIWDBQuad[] => compose(
        transform(config, opt),
        arquadFromDB,
        readFromFile(config),
    )();
