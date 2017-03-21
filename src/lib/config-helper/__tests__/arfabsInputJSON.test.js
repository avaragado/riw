// @flow

import path from 'path';

import mock from 'mock-fs';

import type { ConfigSparseWithSource } from '../../config';
import { configResolve } from '../../config';

import arfabsInputJSON from '../arfabsInputJSON';

type Tree = { [key: string]: string | Tree };

type Fixture = {
    name: string,
    in: Tree,
    cfg: ConfigSparseWithSource,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty dir -> empty array',
        in: {}, // empty dir
        cfg: {
            rootDir: '/fixtures',
            collateDir: 'dir',
        },
    },

    {
        name: '02 collateDir elsewhere -> empty array',
        in: {
            'a.json': '[]',
            'b.json': '[]',
        },
        cfg: {
            rootDir: '/fixtures',
            // collateDir default is not under dir, so result is empty array
        },
    },

    {
        name: '03 flat files, collateDir rel',
        in: {
            'a.json': '[]',
            'aa.json': '[]',
            'b.json': '[]',
            'bb.json': '[]',
            'c.json': '[]',
        },
        cfg: {
            rootDir: '/fixtures',
            collateDir: 'dir',
        },
    },

    {
        name: '04 flat files, collateDir abs',
        in: {
            'a.json': '[]',
            'aa.json': '[]',
            'b.json': '[]',
            'bb.json': '[]',
            'c.json': '[]',
        },
        cfg: {
            rootDir: '/foobar',
            collateDir: path.resolve('/fixtures', 'dir'),
        },
    },

    {
        name: '05 nested files, collateDir rel',
        in: {
            'a.json': '[]',
            'bs': {
                'b1.json': '[]',
                'b2.json': '[]',
                'b3.json': '[]',
                'bbs': {
                    'b4.json': '[]',
                    'b5.json': '[]',
                },
            },
        },
        cfg: {
            rootDir: '/fixtures',
            collateDir: 'dir',
        },
    },

    {
        name: '06 nested files, collateDir rel to parent of configFile',
        in: {
            'a.json': '[]',
            'bs': {
                'b1.json': '[]',
                'b2.json': '[]',
                'b3.json': '[]',
                'bbs': {
                    'b4.json': '[]',
                    'b5.json': '[]',
                },
            },
        },
        cfg: {
            configFile: '/fixtures/package.json',
            collateDir: 'dir',
        },
    },
];

describe('lib/config-helper/arfabsInputJSON', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                '/fixtures': {
                    'dir': fixture.in,
                },
            });

            const cfg = configResolve(fixture.cfg);

            const received = arfabsInputJSON(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
