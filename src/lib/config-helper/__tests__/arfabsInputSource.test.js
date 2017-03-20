// @flow

import path from 'path';

import mock from 'mock-fs';

import type { ConfigSparseWithSource } from '../../config';
import { configResolve } from '../../config';

import arfabsInputSource from '../arfabsInputSource';

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
            sourceDirs: ['dir/**/*.js'],
        },
    },

    {
        name: '02 sourceDirs elsewhere -> empty array',
        in: {
            'a.js': '//',
            'b.js': '//',
        },
        cfg: {
            rootDir: '/fixtures',
            // sourceDirs default not under dir, so result is empty array
        },
    },

    {
        name: '03 flat files, sourceDirs rel',
        in: {
            'a.js': '//',
            'b.js': '//',
        },
        cfg: {
            rootDir: '/fixtures',
            sourceDirs: ['dir/**/*.js'],
        },
    },

    {
        name: '04 flat files, sourceDirs abs',
        in: {
            'a.js': '//',
            'b.js': '//',
        },
        cfg: {
            rootDir: '/foobar',
            sourceDirs: [path.resolve('/fixtures', 'dir', '**/*.js')],
        },
    },

    {
        name: '05 nested files, multiple sourceDirs rel',
        in: {
            a: {
                'aa.js': '//',
                'ab.js': '//',
            },
            b: {
                'ba.js': '//',
                'bb.js': '//',
                'bc': {
                    'bcd.js': '//',
                },
            },
        },
        cfg: {
            rootDir: '/fixtures',
            sourceDirs: ['dir/a/*.js', 'dir/b/*.js'],
        },
    },

    {
        name: '06 nested files, multiple sourceDirs rel to parent of configFile',
        in: {
            a: {
                'aa.js': '//',
                'ab.js': '//',
            },
            b: {
                'ba.js': '//',
                'bb.js': '//',
                'bc': {
                    'bcd.js': '//',
                },
            },
        },
        cfg: {
            configFile: '/fixtures/package.json',
            sourceDirs: ['dir/a/*.js', 'dir/b/*.js'],
        },
    },
];

describe('lib/config-helper/arfabsInputSource', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                '/fixtures': {
                    dir: fixture.in,
                },
            });

            const cfg = configResolve(fixture.cfg);

            const received = arfabsInputSource(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
