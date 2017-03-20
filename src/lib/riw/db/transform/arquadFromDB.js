// @flow

import toPairs from 'ramda/src/toPairs';
import chain from 'ramda/src/chain';
import map from 'ramda/src/map';

import type { TranslationQuad } from '../../../../types';
import type { TranslationsDB } from '../';

const quadify = obj => chain(
    ([key, val]) => {
        if (typeof val === 'string') {
            return [[key, val]];
        }

        return map(
            keys => [key, ...keys],
            quadify(val),
        );
    },
    toPairs(obj),
);

export default (db: TranslationsDB): TranslationQuad[] => quadify(db.data);
