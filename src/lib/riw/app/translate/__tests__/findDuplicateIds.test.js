// @flow

import type { MessageDescriptorWithFile } from '../../../../../types';
import findDuplicateIds from '../findDuplicateIds';

const notify = () => x => x;

type Fixture = {
    name: string,
    in: MessageDescriptorWithFile[],
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
                file: 'a',
            },
            {
                id: 'b.1',
                defaultMessage: 'b.1!',
                file: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                file: 'b',
            },
        ],
    },

    {
        name: '03',
        in: [
            {
                id: 'a.1',
                defaultMessage: 'a.1!',
                file: 'a',
            },
            {
                id: 'a.1',
                defaultMessage: 'a.1 again!',
                file: 'aa',
            },
            {
                id: 'b.1',
                defaultMessage: 'b.1!',
                file: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 desc',
                defaultMessage: 'b.2!',
                file: 'b',
            },
            {
                id: 'b.2',
                description: 'b.2 again desc',
                defaultMessage: 'b.2 again!',
                file: 'bb',
            },
            {
                id: 'b.2',
                description: 'b.2 again again desc',
                defaultMessage: 'b.2 again again!',
                file: 'bbb',
            },
            {
                id: 'c.1',
                defaultMessage: 'c.1!',
                file: 'c',
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
