// @flow
// main entry point

import compose from 'ramda/src/compose';

import riwFromConfig from './lib/riw';
import { configResolve } from './lib/config';

export default (
    compose(
        riwFromConfig,
        configResolve,
    ): (config: RIWConfigSparseWithSource) => RIW
);
