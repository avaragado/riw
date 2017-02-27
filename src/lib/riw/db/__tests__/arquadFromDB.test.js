// @flow

import arquadFromDB from '../arquadFromDB';

type Fixture = {
    name: string,
    in: RIWDB,
    out: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: {
            version: 1,
            data: {},
        },
        out: [],
    },

    {
        name: '02 lots of entries',
        in: {
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
        out: [
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UP', 'HELLO'],
            ['hello', 'desc2', 'fr-fr', 'bonjour'],
            ['goodbye', 'desc1', 'en-re', 'eybdoog'],
            ['goodbye', 'desc1', 'en-UP', 'GOODBYE'],
        ],
    },
];

describe('lib/riw/db/arquadFromDB', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = arquadFromDB(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
