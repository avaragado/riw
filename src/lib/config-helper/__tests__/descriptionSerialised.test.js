// @flow

import type { Description } from '../../../types';
import descriptionSerialised from '../descriptionSerialised';

type Fixture = {
    name: string,
    in?: Description,
};

const fixtures: Fixture[] = [
    {
        name: '01 - undefined becomes default description',
    },

    {
        name: '02 - string remains as-is',
        in: 'foobar baz',
    },

    {
        name: '03 - object is stringified with sorted keys',
        in: {
            z: 1,
            a: 2,
            nested: {
                z: 3,
                a: 4,
                m: 5,
            },
            m: 6,
        },
    },

    {
        name: '04 - object is stringified with sorted keys',
        in: {
            a: 2,
            m: 6,
            nested: {
                a: 4,
                m: 5,
                z: 3,
            },
            z: 1,
        },
    },
];

describe('lib/config-helper/descriptionSerialised', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = descriptionSerialised(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
