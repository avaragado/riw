// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arquadFilterFromQuadAr from './transform/arquadFilterFromQuadAr';
import armdtFromQuadAr from './transform/armdtFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBList) => compose(
    armdtFromQuadAr,
    arquadFilterFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
