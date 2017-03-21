// @flow

import type { ConfigSparse, ConfigSparseWithSource } from '../../config';
import log from '../../log';

import fabsPackageJSONFromDabs from './fabsPackageJSONFromDabs';
import fabsConfigPackageFromPackageJSONFabs from './fabsConfigPackageFromPackageJSONFabs';

export default (): ?ConfigSparseWithSource => {
    const fabsPackageJSON = fabsPackageJSONFromDabs(process.cwd());
    const fabsConfigPackage = fabsConfigPackageFromPackageJSONFabs(fabsPackageJSON);

    if (!fabsPackageJSON || !fabsConfigPackage) {
        log.error('riw', 'Unable to find package root');
        return null;
    }

    try {
        return {
            ...(require(fabsConfigPackage): ConfigSparse),
            configFile: fabsConfigPackage,
        };

    } catch (err) {
        // fabsPackageJSON exists as we hunted the fs for it above:
        // but it might not have the riw key.
        const config: ConfigSparse = require(fabsPackageJSON).riw;

        if (!config) {
            log.warn('No riw app config found. You probably want to add some configuration.');
        }

        return {
            ...config,
            configFile: fabsPackageJSON,
        };
    }
};
