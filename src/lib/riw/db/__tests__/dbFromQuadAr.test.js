// @flow

import dbFromQuadAr from '../dbFromQuadAr';

type Fixture = {
    name: string,
    in: RIWDBQuad[],
    out: RIWDB,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: [],
        out: {
            version: 1,
            data: {},
        },
    },

    {
        name: '02 lots of entries',
        in: [
            ['hello', 'desc2', 'fr-fr', 'OVERWRITTEN bonjour'],
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UP', 'HELLO'],
            ['hello', 'desc2', 'fr-fr', 'bonjour'],
            ['goodbye', 'desc1', 'en-re', 'eybdoog'],
            ['goodbye', 'desc1', 'en-UP', 'GOODBYE'],
        ],
        out: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                        'en-UP': 'HELLO',
                    },
                    'desc2': {
                        'fr-fr': 'bonjour',
                    },
                },
                'goodbye': {
                    'desc1': {
                        'en-re': 'eybdoog',
                        'en-UP': 'GOODBYE',
                    },
                },
            },
        },
    },
];

describe('lib/riw/db/dbFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = dbFromQuadAr(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
