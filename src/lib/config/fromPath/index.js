// @flow

import path from 'path';
import chalk from 'chalk';

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
        log.error('File not found: ', chalk.bold(fabs));
        return null;
    }
};
