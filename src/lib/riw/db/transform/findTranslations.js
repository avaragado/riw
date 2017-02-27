// @flow

import filter from 'ramda/src/filter';

import makeQuadMatcher from './util/makeQuadMatcher';

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBQuadsTransformer = (config, opt?: RIWCLIOptDBFind) => quads =>
    (opt
        ? filter(makeQuadMatcher(opt.match), quads)
        : quads
    );

export default transformer;
