// @flow

import map from 'ramda/src/map';

import { sDescriptionDefault } from '../../';

const quadify = (mdt: RIWTranslatedMessageDescriptor): RIWDBQuad => [
    mdt.defaultMessage,
    mdt.description || sDescriptionDefault,
    mdt.locale,
    mdt.translation,
];

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBConfigurableQuadsTransformer = (config, opt?: RIWCLIOptDBUpdate) => quads =>
    (opt && opt.translations.length > 0
        ? quads.concat(map(quadify, opt.translations))
        : quads
    );

export default transformer;
