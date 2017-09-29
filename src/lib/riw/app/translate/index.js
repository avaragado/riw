// @flow

import compose from 'ramda/src/compose';

import type {
    AbsolutePath,
    MessageDescriptorWithFile,
} from '../../../../types';
import type { Config } from '../../../config';
import type { Notifier } from '../../../notify';
import makeNotifier from '../../../notify';

import db from '../../db';

import type { TranslationLookupResult } from './findTranslations';
import type { DuplicateIdData } from './findDuplicateIds';
import { armdExtractSource, armdExtractJSON } from './extract';
import ardupFind from './findDuplicateIds';
import findTranslations from './findTranslations';
import writeTranslations from './writeTranslations';
import writeTodo from './writeTodo';

export type {
    TranslationLookupResult,
    DuplicateIdData,
};

export type AppTranslateResult = {
    armd: MessageDescriptorWithFile[],
    dups: DuplicateIdData[],
    translation: TranslationLookupResult,
};

export type AppTranslateSpec = {
    on?: {
        start?: () => void,
        startExtract?: (arfabsSource: AbsolutePath[]) => void,
        startExtractFile?: (fabsSource: AbsolutePath) => void,
        endExtractFile?: ({ armd: MessageDescriptorWithFile[], fabs: AbsolutePath }) => void,
        endExtract?: (MessageDescriptorWithFile[]) => void,
        startDupCheck?: (armd: MessageDescriptorWithFile[]) => void,
        endDupCheck?: (dups: DuplicateIdData[]) => void,
        startLookup?: (armd: MessageDescriptorWithFile[]) => void,
        endLookup?: (translation: TranslationLookupResult) => void,
        fileSaved?: (fabs: AbsolutePath) => void,
        end?: (result: AppTranslateResult) => void,
    },
};

type Processor = (config: Config, notify: Notifier) => AppTranslateResult;

const process: Processor = (config, notify) => compose(
    notify('end'),
    armd => ({
        armd,
        dups: ardupFind(notify)(armd),
        translation: compose(
            writeTodo(config, notify),
            writeTranslations(config, notify),
            findTranslations(config, notify, db(config).read()),
        )(armd),
    }),
    {
        source: armdExtractSource(notify),
        json: armdExtractJSON(notify),
    }[config.inputMode],
    notify('start'),
)(config);

export default (config: Config) => (opt: AppTranslateSpec): AppTranslateResult =>
    process(config, makeNotifier(opt.on));
