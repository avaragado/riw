// @flow

import glob from 'glob';
import chain from 'ramda/src/chain';

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
