// @flow

import type { ConfigSparse, ConfigSparseWithSource } from '../../../config';
import { configResolve } from '../../../config';
import tof from '../';

const configBase: ConfigSparse = {
    // common for these tests:
    translationsOutputFile: 'dummy',
};

type Fixture = {
    name: string,
    configOverride: ConfigSparseWithSource,
    out: boolean,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            configFile: '/a/b/c/foo.js',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        out: true,
    },

    {
        name: '02 file-per-locale replaces placeholder with locale',
        configOverride: {
            configFile: '/aa/foo.js',
            translationsOutputFile: 'bb/wibble.json',
        },
        out: false,
    },
];

describe('lib/translationsOutputFile/hasPlaceholder', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = configResolve({
                ...configBase,
                ...fixture.configOverride,
            });

            const received = tof(cfg).hasPlaceholder();

            expect(received).toBe(fixture.out);
        });
    });
});
