// @flow

import map from 'ramda/src/map';

import type { TranslatedMessageDescriptor, TranslationQuad } from '../../../../types';
import { sDescriptionDefault } from '../../';

type Transformer = (quads: TranslationQuad[]) => TranslatedMessageDescriptor[];

const fromQuad = (quad: TranslationQuad): TranslatedMessageDescriptor => ({
    defaultMessage: quad[0],
    locale: quad[2],
    translation: quad[3],
    ...(quad[1] === sDescriptionDefault ? null : { description: quad[1] }),
});

const fromQuads: Transformer = map(fromQuad);

export default fromQuads;
