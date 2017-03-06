// @flow

import compose from 'ramda/src/compose';
import prop from 'ramda/src/prop';

import dateMTimeFromFabs from './dateMTimeFromFabs';

type Result = (config: RIWConfig) => {
    dateConfig: number,
};

const result: Result = compose(
    dateConfig => ({ dateConfig }),
    dateMTimeFromFabs,
    prop('configFile'),
);

export default result;
