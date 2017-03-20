// @flow

import type { Config } from '../../../config';
import type {
    LocaleId,
    UntranslatedMessageDescriptor,
} from '../../../../types';

import ctDistinctForLocales from './ctDistinctForLocales';
import todo from './todo';
import dateInputNewest from './dateInputNewest';
import dateTodo from './dateTodo';
import dateDB from './dateDB';
import dateConfig from './dateConfig';

export type AppStatusResult = {
    default: ?number,
    target: {
        [key: LocaleId]: ?number,
    },
    todo: null | {
        [key: LocaleId]: UntranslatedMessageDescriptor[],
    },
    dateInputNewest: number,
    dateTodo: number,
    dateDB: number,
    dateConfig: number,
};

type Status = (config: Config) => () => AppStatusResult;

const status: Status = config => () => ({
    ...ctDistinctForLocales(config),
    ...todo(config),
    ...dateInputNewest(config),
    ...dateTodo(config),
    ...dateDB(config),
    ...dateConfig(config),
});

export default status;
