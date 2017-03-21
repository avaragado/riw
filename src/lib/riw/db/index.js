// @flow

import type {
    LocaleId,
    DefaultMessage,
    Description,
    TranslatedMessage,
    TranslatedMessageDescriptor,
} from '../../../types';
import type { Config } from '../../config';

import type { DBUpdateSpec } from './update';
import type { DBListSpec } from './list';
import type { DBStatusResult } from './status';
import type { TranslationMatchSpec } from './util/makeQuadMatcher';
import dbRead from './rw/dbRead';
import init from './init';
import list from './list';
import status from './status';
import update from './update';
import del from './delete';

export type Version = number;

export type TranslationsDB = {
    version: Version,
    data: {
        [key: DefaultMessage]: {
            [key: Description]: {
                [key: LocaleId]: TranslatedMessage,
            },
        },
    },
};

export type {
    DBUpdateSpec,
    DBListSpec,
    DBStatusResult,
    TranslationMatchSpec,
};

export type DB = {|
    init: () => void,
    read: () => TranslationsDB,
    list: (opt: DBListSpec) => TranslatedMessageDescriptor[],
    status: () => DBStatusResult,
    update: (opt: DBUpdateSpec) => void,
    delete: (opt: DBListSpec) => void,
|};

export default (config: Config) => ({
    init: init(config),
    read: dbRead(config),
    list: list(config),
    status: status(config),
    update: update(config),
    delete: del(config),
});
