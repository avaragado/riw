// @flow

import path from 'path';

import glob from 'glob';

import type { FilesFromConfig } from './';

const arfabsInputJSON: FilesFromConfig = config =>
    glob.sync(
        '**/*.json',
        {
            cwd: path.resolve(config.rootDir, config.collateDir),
            absolute: true,
        },
    );

export default arfabsInputJSON;
