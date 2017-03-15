// @flow

import dbRead from './rw/dbRead';
import init from './init';
import find from './find';
import status from './status';
import update from './update';
import del from './delete';

export default (config: RIWConfig) => ({
    init: init(config),
    read: dbRead(config),
    find: find(config),
    status: status(config),
    update: update(config),
    delete: del(config),
});