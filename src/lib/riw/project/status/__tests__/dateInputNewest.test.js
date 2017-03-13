// @flow

import mock from 'mock-fs';

import { configResolve } from '../../../../config';

import dateInputNewest from '../dateInputNewest';

type Fixture = {
    name: string,
    cfg: RIWConfigSparseWithSource,
    in: {
        [key: string]: any,
    },
};

const fixtures: Fixture[] = [
    {
        name: '01',
        cfg: {
            inputMode: 'source',
            sourceDirs: ['fixtures/src/*.js'],
        },
        in: {},
    },

    {
        name: '02',
        cfg: {
            inputMode: 'source',
            sourceDirs: ['fixtures/src/*.js'],
        },
        in: {
            'foo.js': mock.file({
                content: '//',
                mtime: new Date(2000),
            }),
            'bar.js': mock.file({
                content: '//',
                mtime: new Date(1000),
            }),
            'baz.js': mock.file({
                content: '//',
                mtime: new Date(5000),
            }),
            'quux.js': mock.file({
                content: '//',
                mtime: new Date(3000),
            }),
        },
    },

    {
        name: '03',
        cfg: {
            inputMode: 'json',
            collateDir: 'fixtures/src',
        },
        in: {},
    },

    {
        name: '04',
        cfg: {
            inputMode: 'json',
            collateDir: 'fixtures/src',
        },
        in: {
            'foo.json': mock.file({
                content: '[]',
                mtime: new Date(2000),
            }),
            'bar.json': mock.file({
                content: '[]',
                mtime: new Date(1000),
            }),
            'baz.json': mock.file({
                content: '[]',
                mtime: new Date(5000),
            }),
            'quux.json': mock.file({
                content: '[]',
                mtime: new Date(3000),
            }),
        },
    },
];

describe('lib/riw/project/status/dateInputNewest', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    src: fixture.in,
                },
            });

            const cfg = configResolve(fixture.cfg);

            const received = dateInputNewest(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
