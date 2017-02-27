// @flow

import reject from 'ramda/src/reject';

import makeQuadMatcher from './util/makeQuadMatcher';

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBQuadsTransformer = (config, opt?: RIWCLIOptDBFind) => quads =>
    (opt
        ? reject(makeQuadMatcher(opt.match), quads)
        : quads
    );

export default transformer;
