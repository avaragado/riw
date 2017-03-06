// @flow

import compose from 'ramda/src/compose';

import makeNotifier from '../../../notify';

import db from '../../db';

import { armdExtractSource, armdExtractJSON } from './extract';
import ardupFind from './findDuplicateIds';
import findTranslations from './findTranslations';
import writeTranslations from './writeTranslations';
import writeTodo from './writeTodo';

const process = (config, notify) => compose(
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

export default (config: RIWConfig) =>
    (opt: RIWCLIOptProjectTranslate): RIWCLIProjectTranslateResult =>
    process(config, makeNotifier(opt.on));
