// @flow

import path from 'path';

import type { Config, ConfigSparseWithSource } from '../../config';

import configDefault from './configDefault';

const maybeAddRootDir = ({ configFile, rootDir }) => (
    configFile && !rootDir
        ? { rootDir: path.dirname(configFile) }
        : {}
);

export default (config: ConfigSparseWithSource): Config => ({
    ...configDefault,
    ...config,
    ...maybeAddRootDir(config),
});
