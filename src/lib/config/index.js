// @flow

import type { AbsolutePath, LocaleId, Path, Glob } from '../../types';
import configDefault from './resolve/configDefault';
import fabsConfigPackageForCWD from './fromPackage/fabsConfigPackageForCWD';
import configFromPath from './fromPath';
import configFromPackage from './fromPackage';
import configResolve from './resolve';

export type InputMode = 'source' | 'json';
export type OutputMode = 'single-file' | 'file-per-locale' | 'no-file';

export type ConfigSparse = {
    defaultLocale?: LocaleId,
    targetLocales?: LocaleId[],
    translationsDatabaseFile?: Path,
    sourceDirs?: Glob[],
    collateDir?: Path,
    inputMode?: InputMode,
    translationsOutputFile?: Path,
    outputMode?: OutputMode,
    todoFile?: Path,
};

type ConfigSource = {
    configFile?: AbsolutePath,
    rootDir?: AbsolutePath,
};

export type ConfigSparseWithSource = ConfigSource & ConfigSparse;

export type Config = {
    rootDir: AbsolutePath,
    configFile?: AbsolutePath, // remains optional as API user might not have one
    defaultLocale: LocaleId,
    targetLocales: LocaleId[],
    translationsDatabaseFile: Path,
    sourceDirs: Glob[],
    collateDir: Path,
    inputMode: InputMode,
    translationsOutputFile: Path,
    outputMode: OutputMode,
    todoFile: Path,
};

export {
    configDefault,
    fabsConfigPackageForCWD,
    configFromPath,
    configFromPackage,
    configResolve,
};
