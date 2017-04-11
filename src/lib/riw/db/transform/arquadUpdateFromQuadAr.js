// @flow

import map from 'ramda/src/map';

import type { TranslatedMessageDescriptor, TranslationQuad } from '../../../../types';
import type { DBUpdateSpec } from '../update';
import { descriptionSerialised } from '../../../config-helper';

const quadify = (mdt: TranslatedMessageDescriptor): TranslationQuad => [
    mdt.defaultMessage,
    descriptionSerialised(mdt.description),
    mdt.locale,
    mdt.translation,
];

// eslint-disable-next-line no-unused-vars
const transformer = (opt?: DBUpdateSpec) => (quads: TranslationQuad[]) =>
    (opt && opt.translations.length > 0
        ? quads.concat(map(quadify, opt.translations))
        : quads
    );

export default transformer;
