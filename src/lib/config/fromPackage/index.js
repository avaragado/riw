// @flow

import log from '../../log';

import fabsPackageJSONFromDabs from './fabsPackageJSONFromDabs';
import fabsConfigPackageFromPackageJSONFabs from './fabsConfigPackageFromPackageJSONFabs';

export default (): ?RIWConfigSparseWithSource => {
    const fabsPackageJSON = fabsPackageJSONFromDabs(process.cwd());
    const fabsConfigPackage = fabsConfigPackageFromPackageJSONFabs(fabsPackageJSON);

    if (!fabsPackageJSON || !fabsConfigPackage) {
        log.error('riw', 'Unable to find package root');
        return null;
    }

    try {
        return {
            ...(require(fabsConfigPackage): RIWConfigSparse),
            configFile: fabsConfigPackage,
        };

    } catch (err) {
        // fabsPackageJSON exists as we hunted the fs for it above:
        // but it might not have the riw key.
        const config: RIWConfigSparse = require(fabsPackageJSON).riw;

        if (!config) {
            log.warn('riw', 'No app config found. You probably want to add some configuration.');
        }

        return {
            ...config,
            configFile: fabsPackageJSON,
        };
    }
};
