// @flow

import reduce from 'ramda/src/reduce';
import assocPath from 'ramda/src/assocPath';

import rdbEmpty from '../rdbEmpty';

const unquadify = reduce(
    (acc, quad) => assocPath(quad.slice(0, 3), quad[3], acc),
    {},
);

// eslint-disable-next-line no-unused-vars
const fromQuads = (config: RIWConfig) => (quads: RIWDBQuad[]): RIWDB => ({
    ...rdbEmpty(config)(),
    data: unquadify(quads),
});

export default fromQuads;
