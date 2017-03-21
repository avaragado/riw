// @flow

import path from 'path';

import compose from 'ramda/src/compose';
import groupBy from 'ramda/src/groupBy';
import prop from 'ramda/src/prop';

import type { LocaleId, UntranslatedMessageDescriptor } from '../../../../types';
import type { Config } from '../../../config';

import loadJSONOrNull from './loadJSONOrNull';

type Result = (config: Config) => {
    todo: null | {
        [key: LocaleId]: UntranslatedMessageDescriptor[],
    },
};

const result: Result = compose(
    todo => ({ todo }),
    (armdu: ?UntranslatedMessageDescriptor[]) => (armdu == null
        ? null
        : groupBy(prop('locale'), armdu)
    ),
    loadJSONOrNull,
    (config: Config) => path.resolve(
        config.rootDir,
        config.todoFile,
    ),
);

export default result;
