// @flow

import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import difference from 'ramda/src/difference';
import uniq from 'ramda/src/uniq';

import type { LocaleId, DefaultPair, TranslationQuad } from '../../../../types';
import type { DBStatusResult } from '../';

type LocalePairMap = {
    [key: LocaleId]: DefaultPair[],
};

type Intermediate = {
    arpairDefault: DefaultPair[],
    ararpairDefaultByLid: LocalePairMap,
}

type StatusFromQuadAr = (arquad: TranslationQuad[]) => DBStatusResult;

const arStatusByLidFromQuadAr: StatusFromQuadAr = compose(
    (data: Intermediate): DBStatusResult => ({
        default: data.arpairDefault,
        locale: map(
            arpair => ({
                has: arpair,
                missing: difference(data.arpairDefault, arpair),
            }),
            data.ararpairDefaultByLid,
        ),
    }),
    (arquad: TranslationQuad[]): Intermediate => ({
        arpairDefault: compose(
            uniq,
            map((quad: TranslationQuad) => quad.slice(0, 2)),
        )(arquad),
        ararpairDefaultByLid: reduce(
            (ararpairByLocale: LocalePairMap, quad: TranslationQuad) => {
                const [defaultMessage, description, lid] = quad;

                if (lid in ararpairByLocale) {
                    ararpairByLocale[lid].push([defaultMessage, description]);
                } else {
                    ararpairByLocale[lid] = [[defaultMessage, description]];
                }

                return ararpairByLocale;
            },
            {},
            arquad,
        ),
    }),
);

export default arStatusByLidFromQuadAr;
