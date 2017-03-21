// @flow
// main entry point

import compose from 'ramda/src/compose';

import type { Config, ConfigSparseWithSource } from './lib/config';
import type {
    RIW,
    AppTranslateSpec,
    AppTranslateResult,
    AppStatusResult,
    TranslationLookupResult,
    DuplicateIdData,
    TranslationsDB,
    DBListSpec,
    DBStatusResult,
    DBUpdateSpec,
} from './lib/riw';
import type { Notifier } from './lib/notify';

import { configResolve, configFromPath, configFromPackage } from './lib/config';
import { riwFromConfig, sDescriptionDefault } from './lib/riw';

const createRIW = (compose(
    riwFromConfig,
    configResolve,
): (config: ConfigSparseWithSource) => RIW);

export type {
    Config,
    ConfigSparseWithSource,
    Notifier,
    RIW,
    AppTranslateSpec,
    AppTranslateResult,
    AppStatusResult,
    TranslationLookupResult,
    DuplicateIdData,
    TranslationsDB,
    DBListSpec,
    DBStatusResult,
    DBUpdateSpec,
};

export {
    createRIW,
    configFromPath,
    configFromPackage,
    sDescriptionDefault,
};
