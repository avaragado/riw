// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import writeFromDB from './rw/writeFromDB';
import arquadFromDB from './transform/arquadFromDB';
import dbFromQuadAr from './transform/dbFromQuadAr';
import arquadUpdateFromQuadAr from './transform/arquadUpdateFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBUpdate) => compose(
    writeFromDB(config),
    dbFromQuadAr,
    arquadUpdateFromQuadAr(config, opt),
    arquadFromDB,
    dbRead(config),
)();
