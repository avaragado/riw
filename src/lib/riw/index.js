// @flow

import type { Config } from '../config';

import type {
    DB,
    TranslationsDB,
    DBListSpec,
    DBStatusResult,
    DBUpdateSpec,
} from './db';
import type {
    AppStatusResult,
    AppTranslateSpec,
    AppTranslateResult,
    TranslationLookupResult,
    DuplicateIdData,
    App,
} from './app';
import db from './db';
import app from './app';

export type RIW = {|
    config: Config,
    db: DB,
    app: App,
|};

export type {
    AppStatusResult,
    AppTranslateSpec,
    AppTranslateResult,
    TranslationLookupResult,
    DuplicateIdData,
    TranslationsDB,
    DBListSpec,
    DBStatusResult,
    DBUpdateSpec,
};

export const sDescriptionDefault = '_';

export const riwFromConfig = (config: Config): RIW => ({
    config,
    db: db(config),
    app: app(config),
});
