// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arquadFindFromQuadAr from './transform/arquadFindFromQuadAr';
import armdtFromQuadAr from './transform/armdtFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBFind) => compose(
    armdtFromQuadAr,
    arquadFindFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
