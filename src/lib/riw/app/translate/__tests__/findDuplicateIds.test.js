// @flow

import findDuplicateIds from '../findDuplicateIds';

const notify = () => x => x;

type Fixture = {
    name: string,
    in: RIWMessageDescriptor[],
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: [],
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
    },
];

describe('lib/riw/app/translate/findDuplicateIds', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {

            const received = findDuplicateIds(notify)(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
