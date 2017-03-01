// @flow

import compose from 'ramda/src/compose';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arquadFindFromQuadAr from './transform/arquadFindFromQuadAr';

export default (config: RIWConfig) => (opt?: RIWCLIOptDBFind) => compose(
    arquadFindFromQuadAr(config, opt),
    arquadFromDB,
    dbRead(config),
)();
