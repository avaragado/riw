// @flow

import reject from 'ramda/src/reject';

import type { TranslationQuad } from '../../../../types';
import makeQuadMatcher from '../util/makeQuadMatcher';
import type { DBListSpec } from '../';

// eslint-disable-next-line no-unused-vars
const transformer = (opt?: DBListSpec) => (quads: TranslationQuad[]) =>
    (opt
        ? reject(makeQuadMatcher(opt.match), quads)
        : quads
    );

export default transformer;
