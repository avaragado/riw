// @flow

import path from 'path';

import type { Path, AbsolutePath } from '../../../types';
import type { ConfigSparse, ConfigSparseWithSource } from '../../config';
import log from '../../log';

export default (pathConfig: Path): ?ConfigSparseWithSource => {
    const fabs: AbsolutePath = path.resolve(pathConfig);

    try {
        return {
            ...(require(fabs): ConfigSparse),
            configFile: fabs,
        };

    } catch (err) {
        log.error('riw', 'File not found: %j.', fabs);
        return null;
    }
};
