// @flow

import compose from 'ramda/src/compose';

import type {
    TranslatedMessageDescriptor,
} from '../../../types';
import type { Config } from '../../config';

import dbRead from './rw/dbRead';
import writeFromDB from './rw/writeFromDB';
import arquadFromDB from './transform/arquadFromDB';
import dbFromQuadAr from './transform/dbFromQuadAr';
import arquadUpdateFromQuadAr from './transform/arquadUpdateFromQuadAr';

export type DBUpdateSpec = {
    translations: TranslatedMessageDescriptor[],
};

export default (config: Config) => (opt?: DBUpdateSpec) => compose(
    writeFromDB(config),
    dbFromQuadAr,
    arquadUpdateFromQuadAr(opt),
    arquadFromDB,
    dbRead(config),
)();
