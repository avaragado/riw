// @flow

import path from 'path';
import fs from 'fs';
import glob from 'glob';

import compose from 'ramda/src/compose';
import chain from 'ramda/src/chain';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import reduce from 'ramda/src/reduce';
import max from 'ramda/src/max';

const arfabsFindByMode: { [key: InputMode]: (config: RIWConfig) => AbsolutePath[] } = {
    source: config => chain(
        (sGlob: Glob) => glob.sync(
            sGlob,
            {
                cwd: config.rootDir,
                absolute: true,
            },
        ),
        config.sourceDirs,
    ),

    json: config => glob.sync(
        '**/*.json',
        {
            cwd: path.resolve(config.rootDir || '.', config.collateDir),
            absolute: true,
        },
    ),
};

export default (config: RIWConfig): { dateInputNewest: number } => compose(
    dateInputNewest => ({ dateInputNewest }),
    reduce(max, 0),
    map(compose(prop('mtime'), fs.statSync)),
    () => arfabsFindByMode[config.inputMode](config),
)();
