// @flow

import map from 'ramda/src/map';

import { sDescriptionDefault } from '../../';

type Transformer = (quads: RIWDBQuad[]) => RIWTranslatedMessageDescriptor[];

const fromQuad = (quad: RIWDBQuad): RIWTranslatedMessageDescriptor => ({
    defaultMessage: quad[0],
    locale: quad[2],
    translation: quad[3],
    ...(quad[1] === sDescriptionDefault ? null : { description: quad[1] }),
});

const fromQuads: Transformer = map(fromQuad);

export default fromQuads;
