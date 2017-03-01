// @flow

import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import difference from 'ramda/src/difference';
import uniq from 'ramda/src/uniq';

type LocalePairMap = {
    [key: LocaleId]: RIWDBPair[],
};

type Intermediate = {
    arpairDefault: RIWDBPair[],
    ararpairDefaultByLid: LocalePairMap,
}

type StatusFromQuadAr = (arquad: RIWDBQuad[]) => RIWCLIDBStatusResult;

const arStatusByLidFromQuadAr: StatusFromQuadAr = compose(
    (data: Intermediate): RIWCLIDBStatusResult => ({
        default: data.arpairDefault,
        translation: map(
            arpair => ({
                has: arpair,
                missing: difference(data.arpairDefault, arpair),
            }),
            data.ararpairDefaultByLid,
        ),
    }),
    (arquad: RIWDBQuad[]): Intermediate => ({
        arpairDefault: compose(
            uniq,
            map((quad: RIWDBQuad) => quad.slice(0, 2)),
        )(arquad),
        ararpairDefaultByLid: reduce(
            (ararpairByLocale: LocalePairMap, quad: RIWDBQuad) => {
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
