// @flow

import fs from 'fs';

import compose from 'ramda/src/compose';

import type { MessageDescriptorsFromFile } from './extract';

const armdFromJSONFabs: MessageDescriptorsFromFile = compose(
    JSON.parse,
    fs.readFileSync,
);

export default armdFromJSONFabs;
