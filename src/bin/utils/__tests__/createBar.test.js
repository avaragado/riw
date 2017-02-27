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
    out: string,
};

const makeOut = ({ ctBlock, sPart, ctSpace, sDim }) =>
    `${chalk.green('⣿'.repeat(ctBlock) + sPart + ' '.repeat(ctSpace))} ${chalk.dim(sDim)}`;

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 0,
        },
        out: makeOut({ ctBlock: 0, sPart: '', ctSpace: 10, sDim: '0/100' }),
    },

    {
        name: '02',
        in: {
            ctTotal: 200,
            ctChar: 20,
            num: 200,
        },
        out: makeOut({ ctBlock: 20, sPart: '', ctSpace: 0, sDim: '200/200' }),
    },

    {
        name: '03',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 50,
        },
        out: makeOut({ ctBlock: 5, sPart: '', ctSpace: 5, sDim: '50/100' }),
    },

    {
        name: '04',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 19,
        },
        out: makeOut({ ctBlock: 2, sPart: '⡆', ctSpace: 7, sDim: '19/80' }),
    },

    {
        name: '05',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 20,
        },
        out: makeOut({ ctBlock: 2, sPart: '⡇', ctSpace: 7, sDim: '20/80' }),
    },

    {
        name: '06',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 1,
        },
        out: makeOut({ ctBlock: 0, sPart: '', ctSpace: 10, sDim: '1/100' }),
    },

    {
        name: '07',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 2,
        },
        out: makeOut({ ctBlock: 0, sPart: '⡀', ctSpace: 9, sDim: '2/100' }),
    },

    {
        name: '08',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 54,
        },
        out: makeOut({ ctBlock: 5, sPart: '⡆', ctSpace: 4, sDim: '54/100' }),
    },
];

describe('bin/utils/createBar', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = createBar(fixture.in.ctTotal, fixture.in.ctChar)(fixture.in.num);

            expect(received).toBe(fixture.out);
        });
    });
});
