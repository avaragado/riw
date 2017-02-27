// @flow

import chain from 'ramda/src/chain';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import pathOr from 'ramda/src/pathOr';
import assocPath from 'ramda/src/assocPath';

import { sDescriptionDefault } from '../';

type LocaleMapper = (config: RIWConfig) => (md: RIWMessageDescriptor) =>
    RIWMessageDescriptorUntranslated;

type TranslationLookup = {
    mdu: RIWMessageDescriptorUntranslated,
    result: RIWDBTranslatedMessage | null,
};

type LookerUpper = (config: RIWConfig, db: RIWDB) => (mdu: RIWMessageDescriptorUntranslated) =>
    TranslationLookup;

type LookupReducer = (acc: RIWFindTranslationResult, lookup: TranslationLookup) =>
    RIWFindTranslationResult;

type TranslationFinder = <T>(
    config: RIWConfig,
    notify: string => T => T,
    db: RIWDB
) => (armd: RIWMessageDescriptor[]) => RIWFindTranslationResult;


const resultEmpty: RIWFindTranslationResult = {
    locale: {},
    armdu: [],
};

const eachLocale: LocaleMapper = config => md => map(
    locale => ({ ...md, locale }),
    config.targetLocales.concat(config.defaultLocale),
);

const includeLookup: LookerUpper = (config, db) => mdu => ({
    mdu,
    result: mdu.locale === config.defaultLocale
        ? mdu.defaultMessage
        : pathOr(null, [
            'data',
            mdu.defaultMessage,
            mdu.description || sDescriptionDefault,
            mdu.locale,
        ], db),
});

const reduceLookup: LookupReducer = (acc, lookup) => {
    const { mdu, result } = lookup;

    if (result) {
        return assocPath(['locale', mdu.locale, mdu.id], result, acc);
    }

    return {
        ...acc,
        armdu: acc.armdu.concat(mdu),
    };
};

const find: TranslationFinder = (config, notify, db) => compose(
    notify('endLookup'),
    reduce(reduceLookup, resultEmpty),
    map(includeLookup(config, db)),
    chain(eachLocale(config)),
    notify('startLookup'),
);

export default find;
