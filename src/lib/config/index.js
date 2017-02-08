// @flow

import path from 'path';

import findUp from 'find-up';
import compose from 'ramda/src/compose';

import log from '../log';

const configDefault: RIWConfig = {
    defaultLocale: 'en-us',
};

const fabsPackageJSONFromDabs = (cwd: AbsolutePath): ?AbsolutePath =>
    findUp.sync('package.json', { cwd });

const fabsConfigPackageFromPackageJSONFabs = (fabsPackageJSON: ?AbsolutePath): ?AbsolutePath =>
    fabsPackageJSON
        ? path.resolve(path.dirname(fabsPackageJSON), '.riw-config.js')
        : null;

const fabsConfigPackageForCWD = compose(
    fabsConfigPackageFromPackageJSONFabs,
    fabsPackageJSONFromDabs,
    () => process.cwd(),
);

const requireOrNull = (fabs: AbsolutePath): ?Object => {
    try {
        return require(fabs);

    } catch (err) {
        return null;
    }
};

const configFromPath = (fabsOrFrel: string): ?RIWConfig => {
    const fabs = path.isAbsolute(fabsOrFrel)
        ? fabsOrFrel
        : path.resolve('.', fabsOrFrel);

    const configOverride = requireOrNull(fabs);

    if (configOverride === null) {
        log.error('riw', 'File not found: %j.', fabs);
        return null;
    }

    return {
        ...configDefault,
        ...configOverride,
    };
};

const configFromPackage = (): ?RIWConfig => {
    const fabsPackageJSON = fabsPackageJSONFromDabs(process.cwd());
    const fabsConfigPackage = fabsConfigPackageFromPackageJSONFabs(fabsPackageJSON);

    if (!fabsConfigPackage || !fabsPackageJSON) {
        log.error('riw', 'Unable to find package root');
        return null;
    }

    let configOverride: ?Object = requireOrNull(fabsConfigPackage);

    if (configOverride === null) {
        configOverride = requireOrNull(fabsPackageJSON);

        if (configOverride && configOverride.riw) {
            configOverride = configOverride.riw;
        } else {
            configOverride = null;
        }
    }

    if (configOverride === null) {
        log.warn('riw', 'No config located for the project. You probably want to add some configuration.');
        configOverride = {};
    }

    return {
        ...configDefault,
        ...configOverride,
    };

};

const configFromOptionalPath = (fabsOrFrel: ?string): ?RIWConfig => (fabsOrFrel
        ? configFromPath(fabsOrFrel)
        : configFromPackage());

export {
    configDefault,
    fabsPackageJSONFromDabs,
    fabsConfigPackageFromPackageJSONFabs,
    fabsConfigPackageForCWD,
    configFromOptionalPath,
};
