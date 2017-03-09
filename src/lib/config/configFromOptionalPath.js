// @flow

import path from 'path';

import log from '../log';

import configDefault from './configDefault';
import fabsPackageJSONFromDabs from './fabsPackageJSONFromDabs';
import fabsConfigPackageFromPackageJSONFabs from './fabsConfigPackageFromPackageJSONFabs';

const requireOrNull = (fabs: AbsolutePath): ?Object => {
    try {
        return require(fabs);

    } catch (err) {
        return null;
    }
};

const configFromPath = (pathConfig: Path): ?RIWConfig => {
    const fabs: AbsolutePath = path.resolve(pathConfig);
    const configOverride: ?RIWConfigSparse = requireOrNull(fabs);

    if (configOverride === null) {
        log.error('riw', 'File not found: %j.', fabs);
        return null;
    }

    return {
        ...configDefault,
        ...configOverride,
        configFile: fabs,
        rootDir: path.dirname(fabs),
    };
};

const configFromPackage = (): ?RIWConfig => {
    const fabsPackageJSON = fabsPackageJSONFromDabs(process.cwd());
    const fabsConfigPackage = fabsConfigPackageFromPackageJSONFabs(fabsPackageJSON);

    if (!fabsConfigPackage || !fabsPackageJSON) {
        log.error('riw', 'Unable to find package root');
        return null;
    }

    let fabsConfigUsed: ?AbsolutePath = fabsConfigPackage;
    let configOverride: ?RIWConfigSparse = requireOrNull(fabsConfigPackage);

    if (configOverride === null) {
        fabsConfigUsed = fabsPackageJSON;
        configOverride = requireOrNull(fabsPackageJSON);

        if (configOverride && configOverride.riw) {
            configOverride = configOverride.riw;
        } else {
            configOverride = null;
        }
    }

    if (configOverride === null) {
        log.warn('riw', 'No config located for the project. You probably want to add some configuration.');
        fabsConfigUsed = null;
        configOverride = {};
    }

    return {
        ...configDefault,
        ...configOverride,
        configFile: fabsConfigUsed,
        rootDir: path.dirname(fabsConfigPackage),
    };

};

export default (pathConfig: ?Path): ?RIWConfig => (
    pathConfig
        ? configFromPath(pathConfig)
        : configFromPackage()
);
