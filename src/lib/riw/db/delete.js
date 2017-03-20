// @flow

import compose from 'ramda/src/compose';

import type { Config } from '../../config';

import dbRead from './rw/dbRead';
import writeFromDB from './rw/writeFromDB';
import arquadFromDB from './transform/arquadFromDB';
import dbFromQuadAr from './transform/dbFromQuadAr';
import arquadDeleteFromQuadAr from './transform/arquadDeleteFromQuadAr';

import type { DBListSpec } from './';

export default (config: Config) => (opt?: DBListSpec) => compose(
    writeFromDB(config),
    dbFromQuadAr,
    arquadDeleteFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
