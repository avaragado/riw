// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import writeFromDB from './rw/writeFromDB';
import arquadFromDB from './transform/arquadFromDB';
import dbFromQuadAr from './transform/dbFromQuadAr';
import arquadDeleteFromQuadAr from './transform/arquadDeleteFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBFind) => compose(
    writeFromDB(config),
    dbFromQuadAr,
    arquadDeleteFromQuadAr(config, opt),
    arquadFromDB,
    dbRead(config),
)();
