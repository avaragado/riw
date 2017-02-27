// @flow

import dbEmpty from './dbEmpty';
import writeToFile from './writeToFile';

export default (config: RIWConfig) => () =>
    writeToFile(config, { allowOverwrite: false })(dbEmpty);
