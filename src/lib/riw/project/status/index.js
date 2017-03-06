// @flow

import ctDistinctForLocales from './ctDistinctForLocales';
import todo from './todo';
import dateInputNewest from './dateInputNewest';
import dateTodo from './dateTodo';
import dateDB from './dateDB';
import dateConfig from './dateConfig';

type Status = (config: RIWConfig) => () => RIWCLIProjectStatusResult;

const status: Status = config => () => ({
    ...ctDistinctForLocales(config),
    ...todo(config),
    ...dateInputNewest(config),
    ...dateTodo(config),
    ...dateDB(config),
    ...dateConfig(config),
});

export default status;
