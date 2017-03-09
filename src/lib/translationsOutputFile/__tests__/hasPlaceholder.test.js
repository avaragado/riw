// @flow

import { configDefault } from '../../config';
import tof from '../index';

const configBase: RIWConfig = {
    ...configDefault,

    // interesting for these tests:
    translationsOutputFile: 'dummy',
};

type Fixture = {
    name: string,
    configOverride: RIWConfigSparse,
    out: boolean,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            rootDir: '/a/b/c',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        out: true,
    },

    {
        name: '02 file-per-locale replaces placeholder with locale',
        configOverride: {
            rootDir: '/aa',
            translationsOutputFile: 'bb/wibble.json',
        },
        out: false,
    },
];

describe('lib/translationsOutputFile/hasPlaceholder', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg: RIWConfig = {
                ...configBase,
                ...fixture.configOverride,
            };

            const received = tof(cfg).hasPlaceholder();

            expect(received).toBe(fixture.out);
        });
    });
});
