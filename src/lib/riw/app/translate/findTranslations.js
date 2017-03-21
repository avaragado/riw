// @flow

import chain from 'ramda/src/chain';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import pathOr from 'ramda/src/pathOr';
import assocPath from 'ramda/src/assocPath';

import type {
    LocaleId,
    MessageId,
    TranslatedMessage,
    MessageDescriptorWithFile,
    UntranslatedMessageDescriptor,
} from '../../../../types';
import type { Config } from '../../../config';
import type { Notifier } from '../../../notify';
import type { TranslationsDB } from '../../db';
import { sDescriptionDefault } from '../../';

type LocaleMapper = (config: Config) => (md: MessageDescriptorWithFile) =>
    UntranslatedMessageDescriptor;

type Lookup = {|
    mdu: UntranslatedMessageDescriptor,
    result: TranslatedMessage | null,
|};

export type TranslationLookupResult = {|
    locale: {
        [key: LocaleId]: {
            [key: MessageId]: TranslatedMessage,
        },
    },
    todos: UntranslatedMessageDescriptor[],
|};

type LookerUpper = (config: Config, db: TranslationsDB) =>
    (mdu: UntranslatedMessageDescriptor) => Lookup;

type LookupReducer = (acc: TranslationLookupResult, lookup: Lookup) =>
    TranslationLookupResult;

type TranslationFinder = (
    config: Config,
    notify: Notifier,
    db: TranslationsDB
) => (armd: MessageDescriptorWithFile[]) => TranslationLookupResult;


const resultEmpty: TranslationLookupResult = {
    locale: {},
    todos: [],
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

    return ({
        locale: acc.locale,
        todos: acc.todos.concat(mdu),
    }: TranslationLookupResult);
};

const find: TranslationFinder = (config, notify, db) => compose(
    notify('endLookup'),
    reduce(reduceLookup, resultEmpty),
    map(includeLookup(config, db)),
    chain(eachLocale(config)),
    notify('startLookup'),
);

export default find;
