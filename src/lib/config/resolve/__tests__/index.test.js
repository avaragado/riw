// @flow

import type { ConfigSparseWithSource } from '../../';
import configResolve from '../';

type Fixture = {
    name: string,
    in: ConfigSparseWithSource,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty input config',
        in: {},
    },

    {
        name: '02 empty input config with configFile',
        in: {
            configFile: '/foo/bar/package.json',
        },
    },

    {
        name: '03 empty input config with rootDir',
        in: {
            rootDir: '/foo/bar',
        },
    },

    {
        name: '04 empty input config with both configFile and rootDir',
        in: {
            configFile: '/a/b/c/package.json',
            rootDir: '/foo/bar',
        },
    },
];

describe('lib/config/resolve', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = configResolve(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
