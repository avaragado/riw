// @flow

import reduce from 'ramda/src/reduce';
import assocPath from 'ramda/src/assocPath';

import dbEmpty from '../meta/dbEmpty';

const unquadify = reduce(
    (acc, quad) => assocPath(quad.slice(0, 3), quad[3], acc),
    {},
);

const fromQuads = (quads: RIWDBQuad[]): RIWDB => ({
    ...dbEmpty,
    data: unquadify(quads),
});

export default fromQuads;
