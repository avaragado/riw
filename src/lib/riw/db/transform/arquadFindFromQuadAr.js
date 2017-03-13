// @flow

import filter from 'ramda/src/filter';

import makeQuadMatcher from '../util/makeQuadMatcher';

// eslint-disable-next-line no-unused-vars
const transformer = (opt?: RIWCLIOptDBFind) => (quads: RIWDBQuad[]) =>
    (opt
        ? filter(makeQuadMatcher(opt.match), quads)
        : quads
    );

export default transformer;
