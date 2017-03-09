// @flow

import path from 'path';

import { configDefault } from '../../config';
import tof from '../index';

const configBase: RIWConfig = {
    ...configDefault,

    // interesting for these tests:
    translationsOutputFile: 'dummy',
    outputMode: 'single-file',
};

type Fixture = {
    name: string,
    configOverride: RIWConfigSparse,
    out: AbsolutePath,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            rootDir: '/a/b/c',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        out: '/a/b/c/x/y/foo-locales-bar.json',
    },

    {
        name: '02',
        configOverride: {
            rootDir: '/aa',
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
            const cfg: RIWConfig = {
                ...configBase,
                ...fixture.configOverride,
            };

            const received = tof(cfg).forSingleFile();

            expect(received).toBe(fixture.out);
        });
    });
});
