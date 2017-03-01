// @flow

import compose from 'ramda/src/compose';

import readFromFile from '../readFromFile';
import arquadFromDB from '../arquadFromDB';

import arStatusByLidFromQuadAr from './arStatusByLidFromQuadAr';

export default (config: RIWConfig) => (): RIWCLIDBStatusResult => compose(
    arStatusByLidFromQuadAr,
    arquadFromDB,
    readFromFile(config),
)();
