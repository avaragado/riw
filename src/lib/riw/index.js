// @flow

import initRDB from './initRDB';

export default (config: RIWConfig) => ({
    initRDB: initRDB(config),
    config,
});
