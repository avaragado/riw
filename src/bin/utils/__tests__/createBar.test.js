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

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 0,
        },
        out: `${chalk.green('⣿'.repeat(0) + ' '.repeat(10))} ${chalk.dim('0/100')}`,
    },

    {
        name: '02',
        in: {
            ctTotal: 200,
            ctChar: 20,
            num: 200,
        },
        out: `${chalk.green('⣿'.repeat(20) + ' '.repeat(0))} ${chalk.dim('200/200')}`,
    },

    {
        name: '03',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 50,
        },
        out: `${chalk.green('⣿'.repeat(5) + ' '.repeat(5))} ${chalk.dim('50/100')}`,
    },

    {
        name: '04',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 19,
        },
        out: `${chalk.green('⣿'.repeat(2) + '⡆' + ' '.repeat(7))} ${chalk.dim('19/80')}`,
    },

    {
        name: '05',
        in: {
            ctTotal: 80,
            ctChar: 10,
            num: 20,
        },
        out: `${chalk.green('⣿'.repeat(2) + '⡇' + ' '.repeat(7))} ${chalk.dim('20/80')}`,
    },

    {
        name: '06',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 1,
        },
        out: `${chalk.green('⣿'.repeat(0) + '' + ' '.repeat(10))} ${chalk.dim('1/100')}`,
    },

    {
        name: '07',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 2,
        },
        out: `${chalk.green('⣿'.repeat(0) + '⡀' + ' '.repeat(9))} ${chalk.dim('2/100')}`,
    },

    {
        name: '08',
        in: {
            ctTotal: 100,
            ctChar: 10,
            num: 54,
        },
        out: `${chalk.green('⣿'.repeat(5) + '⡆' + ' '.repeat(4))} ${chalk.dim('54/100')}`,
    },
];

describe('bin/utils/createBar', () => {
    fixtures.forEach(fixture => {
        it(fixture.name, () => {
            const received = createBar(fixture.in.ctTotal, fixture.in.ctChar)(fixture.in.num);

            expect(received).toBe(fixture.out)
        });
    });
});
