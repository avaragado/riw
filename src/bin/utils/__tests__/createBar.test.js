// @flow

import chalk from 'chalk';

import createBar from '../createBar';

type Fixture = {
    name: string,
    in: {
        ctTotal: number,
        ctChar: number,
        num: number,
    },
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 0,
        },
    },

    {
        name: '02',
        in: {
            ctTotal: 200,
            ctChar: 20,
            num: 200,
        },
    },

    {
        name: '03',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 50,
        },
    },

    {
        name: '04',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 19,
        },
    },

    {
        name: '05',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 20,
        },
    },

    {
        name: '06',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 1,
        },
    },

    {
        name: '07',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 2,
        },
    },

    {
        name: '08',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 54,
        },
    },
];

describe('bin/utils/createBar', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = createBar(fixture.in.ctTotal, fixture.in.ctChar)(fixture.in.num);

            expect(received).toMatchSnapshot();
        });
    });
});
