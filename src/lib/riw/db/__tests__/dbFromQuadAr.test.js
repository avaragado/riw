// @flow

import dbFromQuadAr from '../dbFromQuadAr';

type Fixture = {
    name: string,
    in: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: [],
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
    },
];

describe('lib/riw/db/dbFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = dbFromQuadAr(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
