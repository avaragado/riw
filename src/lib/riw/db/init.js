// @flow

import type { Config } from '../../config';

import dbEmpty from './meta/dbEmpty';
import writeFromDB from './rw/writeFromDB';

export default (config: Config) => () =>
    writeFromDB(config, { allowOverwrite: false })(dbEmpty);
