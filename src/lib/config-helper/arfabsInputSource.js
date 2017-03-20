// @flow

import glob from 'glob';
import chain from 'ramda/src/chain';

import type { Glob } from '../../types';
import type { FilesFromConfig } from './';

const arfabsInputSource: FilesFromConfig = config => chain(
    (sGlob: Glob) => glob.sync(
        sGlob,
        {
            cwd: config.rootDir,
            absolute: true,
        },
    ),
    config.sourceDirs,
);

export default arfabsInputSource;
