// @flow

import findDuplicateIds from '../findDuplicateIds';

const notify = () => x => x;

type Fixture = {
    name: string,
    in: RIWMessageDescriptor[],
    out: RIWDuplicateIdData[],
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: [],
        out: [],
    },

    {
        name: '02',
        in: [
            {
                id: 'a.1',
                defaultMessage: 'a.1!',
                fabs: 'a',
            },
            {
                id: 'b.1',
                defaultMessage: 'b.1!',
                fabs: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: 'b',
            },
        ],
        out: [],
    },

    {
        name: '03',
        in: [
            {
                id: 'a.1',
                defaultMessage: 'a.1!',
                fabs: 'a',
            },
            {
                id: 'a.1',
                defaultMessage: 'a.1 again!',
                fabs: 'aa',
            },
            {
                id: 'b.1',
                defaultMessage: 'b.1!',
                fabs: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                fabs: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 again desc',
                defaultMessage: 'b.2 again!',
                fabs: 'bb',
            },
            {
                id: 'b.2',
                description: 'b.2 again again desc',
                defaultMessage: 'b.2 again again!',
                fabs: 'bbb',
            },
            {
                id: 'c.1',
                defaultMessage: 'c.1!',
                fabs: 'c',
            },
        ],
        out: [
            {
                id: 'a.1',
                arfabs: ['a', 'aa'],
            },
            {
                id: 'b.2',
                arfabs: ['b', 'bb', 'bbb'],
            },
        ],
    },
];

describe('lib/riw/translate/findDuplicateIds', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {

            const received = findDuplicateIds(notify)(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
