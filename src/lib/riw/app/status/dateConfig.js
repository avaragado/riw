// @flow

import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';

import type { Config } from '../../../config';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: Config) => {
    dateConfig: number,
};

const result: Result = compose(
    dateConfig => ({ dateConfig }),
    dateMTimeFromFabs,
    prop('configFile'),
);

export default result;
