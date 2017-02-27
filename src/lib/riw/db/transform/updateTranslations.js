// @flow

import map from 'ramda/src/map';

const quadify = (tmd: RIWTranslatedMessageDescriptor): RIWDBQuad => [
    tmd.defaultMessage,
    tmd.description,
    tmd.locale,
    tmd.translation,
];

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBQuadsTransformer = (config, opt?: RIWCLIOptDBUpdate) => quads =>
    (opt && opt.translations.length > 0
        ? quads.concat(map(quadify, opt.translations))
        : quads
    );

export default transformer;
