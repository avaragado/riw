// @flow

import fs from 'fs';

import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import reduce from 'ramda/src/reduce';
import max from 'ramda/src/max';

import { arfabsInputJSON, arfabsInputSource } from '../../../config-helper';

const arfabsFindByMode: { [key: InputMode]: (config: RIWConfig) => AbsolutePath[] } = {
    source: arfabsInputSource,
    json: arfabsInputJSON,
};

export default (config: RIWConfig): { dateInputNewest: number } => compose(
    dateInputNewest => ({ dateInputNewest }),
    reduce(max, 0),
    map(compose(prop('mtime'), fs.statSync)),
    () => arfabsFindByMode[config.inputMode](config),
)();
