// @flow

import arStatusByLidFromQuadAr from '../arStatusByLidFromQuadAr';

type Fixture = {
    name: string,
    in: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: [],
    },
    {
        name: '02',
        in: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
        ],
    },
    {
        name: '03',
        in: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
        ],
    },
    {
        name: '04',
        in: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
            ['three', 'desc1', 'bb-bb', '[bb-bb]1 three'],
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
        ],
    },
];

describe('lib/riw/db/status/arStatusByLidFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = arStatusByLidFromQuadAr(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
