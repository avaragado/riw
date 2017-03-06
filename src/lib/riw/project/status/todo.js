// @flow

import path from 'path';

import compose from 'ramda/src/compose';
import groupBy from 'ramda/src/groupBy';
import prop from 'ramda/src/prop';

import loadJSONOrNull from './loadJSONOrNull';

type Result = (config: RIWConfig) => {
    todo: null | {
        [key: LocaleId]: RIWMessageDescriptorUntranslated[],
    },
};

const result: Result = compose(
    todo => ({ todo }),
    (armdu: ?RIWMessageDescriptorUntranslated[]) => (armdu == null
        ? null
        : groupBy(prop('locale'), armdu)
    ),
    loadJSONOrNull,
    (config: RIWConfig) => path.resolve(
        config.rootDir || '.',
        config.todoFile,
    ),
);

export default result;
