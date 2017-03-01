// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arStatusByLidFromQuadAr from './transform/arStatusByLidFromQuadAr';

export default (config: RIWConfig) => (): RIWCLIDBStatusResult => compose(
    arStatusByLidFromQuadAr,
    arquadFromDB,
    dbRead(config),
)();
