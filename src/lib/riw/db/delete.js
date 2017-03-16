// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import writeFromDB from './rw/writeFromDB';
import arquadFromDB from './transform/arquadFromDB';
import dbFromQuadAr from './transform/dbFromQuadAr';
import arquadDeleteFromQuadAr from './transform/arquadDeleteFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBList) => compose(
    writeFromDB(config),
    dbFromQuadAr,
    arquadDeleteFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
