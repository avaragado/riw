// @flow

import compose from 'ramda/src/compose';

import type {
    LocaleId,
    DefaultPair,
} from '../../../types';
import type { Config } from '../../config';

import dbRead from './rw/dbRead';
import arquadFromDB from './transform/arquadFromDB';
import arStatusByLidFromQuadAr from './transform/arStatusByLidFromQuadAr';

export type DBStatusResult = {
    default: DefaultPair[],
    locale: {
        [key: LocaleId]: {
            has: DefaultPair[],
            missing: DefaultPair[],
        },
    },
};

export default (config: Config) => (): DBStatusResult => compose(
    arStatusByLidFromQuadAr,
    arquadFromDB,
    dbRead(config),
)();
