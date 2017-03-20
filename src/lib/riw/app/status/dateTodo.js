// @flow

import path from 'path';

import compose from 'ramda/src/compose';

import type { Config } from '../../../config';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: Config) => {
    dateTodo: number,
};

const result: Result = compose(
    dateTodo => ({ dateTodo }),
    dateMTimeFromFabs,
    (config: Config) => path.resolve(
        config.rootDir,
        config.todoFile,
    ),
);

export default result;
