// @flow

import path from 'path';

import configDefault from './configDefault';

const maybeAddRootDir = ({ configFile, rootDir }) => (
    configFile && !rootDir
        ? { rootDir: path.dirname(configFile) }
        : {}
);

export default (config: RIWConfigSparseWithSource): RIWConfig => ({
    ...configDefault,
    ...config,
    ...maybeAddRootDir(config),
});
