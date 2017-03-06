// @flow

import fs from 'fs';
import path from 'path';

import glob from 'glob';
import compose from 'ramda/src/compose';

const arfabsFromConfig: FilesFromConfig = config =>
    glob.sync(
        '**/*.json',
        {
            cwd: path.resolve(config.rootDir || '.', config.collateDir),
            absolute: true,
        },
    );

const armdFromFabs: MessageDescriptorsFromFile = compose(
    JSON.parse,
    fs.readFileSync,
);

export {
    arfabsFromConfig,
    armdFromFabs,
};
