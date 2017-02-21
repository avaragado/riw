// @flow

import path from 'path';

import findUp from 'find-up';
import compose from 'ramda/src/compose';

import log from '../log';

const configDefault: RIWConfig = {
    rootDir: '', // overridden below
    defaultLocale: 'en-us',
    targetLocales: [],
    translationsDatabaseFile: 'src/locale/riw-db.json',
    sourceDirs: ['src/**/*.js'],
};

const fabsPackageJSONFromDabs = (cwd: AbsolutePath): ?AbsolutePath =>
    findUp.sync('package.json', { cwd });

const fabsConfigPackageFromPackageJSONFabs = (fabsPackageJSON: ?AbsolutePath): ?AbsolutePath =>
    (fabsPackageJSON
        ? path.resolve(path.dirname(fabsPackageJSON), '.riw-config.js')
        : null);

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

const configFromPath = (pathConfig: Path): ?RIWConfig => {
    const fabs: AbsolutePath = path.resolve(pathConfig);
    const configOverride = requireOrNull(fabs);

    if (configOverride === null) {
        log.error('riw', 'File not found: %j.', fabs);
        return null;
    }

    return {
        ...configDefault,
        ...configOverride,
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
        rootDir: path.dirname(fabsConfigPackage),
    };

};

const configFromOptionalPath = (pathConfig: ?Path): ?RIWConfig => (pathConfig
        ? configFromPath(pathConfig)
        : configFromPackage());

export {
    configDefault,
    fabsPackageJSONFromDabs,
    fabsConfigPackageFromPackageJSONFabs,
    fabsConfigPackageForCWD,
    configFromOptionalPath,
};
