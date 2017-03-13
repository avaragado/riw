// @flow

import path from 'path';

import { configResolve } from '../../../config';
import tof from '../';

const configBase: RIWConfigSparse = {
    // common for these tests:
    translationsOutputFile: 'dummy',
    outputMode: 'single-file',
};

type Fixture = {
    name: string,
    configOverride: RIWConfigSparseWithSource,
    out: AbsolutePath,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            configFile: '/a/b/c/foo.js',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        out: '/a/b/c/x/y/foo-locales-bar.json',
    },

    {
        name: '02',
        configOverride: {
            configFile: '/aa/foo.js',
            translationsOutputFile: 'bb/[locale].json',
        },
        out: '/aa/bb/locales.json',
    },

    {
        name: '03',
        configOverride: {
            translationsOutputFile: 'bb/[locale].json',
        },
        out: path.resolve('bb/locales.json'),
    },
];

describe('lib/translationsOutputFile/forSingleFile', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = configResolve({
                ...configBase,
                ...fixture.configOverride,
            });

            const received = tof(cfg).forSingleFile();

            expect(received).toBe(fixture.out);
        });
    });
});
