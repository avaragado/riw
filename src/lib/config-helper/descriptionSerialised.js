// @flow

import stringify from 'json-stable-stringify';

import type {
    Description,
    SerialisedDescription,
} from '../../types';
import { sDescriptionDefault } from '../riw';

export default (desc: ?Description = sDescriptionDefault): SerialisedDescription => (
    typeof desc === 'string'
        ? desc
        : stringify(desc)
);
