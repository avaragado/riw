// @flow

import dbEmpty from './meta/dbEmpty';
import writeFromDB from './rw/writeFromDB';

export default (config: RIWConfig) => () =>
    writeFromDB(config, { allowOverwrite: false })(dbEmpty);
