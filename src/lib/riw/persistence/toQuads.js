// @flow

import toPairs from 'ramda/src/toPairs';
import chain from 'ramda/src/chain';
import map from 'ramda/src/map';

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

// eslint-disable-next-line no-unused-vars
const toQuads = (config: RIWConfig) => (rdb: RIWDB): RIWDBQuad[] => quadify(rdb.data);

export default toQuads;
