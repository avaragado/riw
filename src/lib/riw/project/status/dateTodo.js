// @flow

import path from 'path';

import compose from 'ramda/src/compose';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: RIWConfig) => {
    dateTodo: number,
};

const result: Result = compose(
    dateTodo => ({ dateTodo }),
    dateMTimeFromFabs,
    (config: RIWConfig) => path.resolve(
        config.rootDir,
        config.todoFile,
    ),
);

export default result;
