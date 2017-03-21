// @flow

import compose from 'ramda/src/compose';

import type { Config } from '../../config';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arquadFilterFromQuadAr from './transform/arquadFilterFromQuadAr';
import armdtFromQuadAr from './transform/armdtFromQuadAr';

import type { TranslationMatchSpec } from './util/makeQuadMatcher';

export type DBListSpec = {
    match: TranslationMatchSpec,
};

export default (config: Config) => (opt?: DBListSpec) => compose(
    armdtFromQuadAr,
    arquadFilterFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
