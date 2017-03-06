// @flow

import path from 'path';

import { configDefault } from '../../config';
import tof from '../index';

const configBase: RIWConfig = {
    ...configDefault,

    // interesting for these tests:
    translationsOutputFile: 'dummy',
    outputMode: 'file-per-locale',
};

type Fixture = {
    name: string,
    configOverride: Object,
    in: LocaleId,
    out: AbsolutePath,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            rootDir: '/a/b/c',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        in: 'aa-aa',
        out: '/a/b/c/x/y/foo-aa-aa-bar.json',
    },

    {
        name: '02',
        configOverride: {
            rootDir: '/aa',
            translationsOutputFile: 'bb/[locale].json',
        },
        in: 'xx-yy',
        out: '/aa/bb/xx-yy.json',
    },

    {
        name: '03',
        configOverride: {
            translationsOutputFile: 'bb/[locale].json',
        },
        in: 'xx-yy',
        out: path.resolve('bb/xx-yy.json'),
    },
];

describe('lib/translationsOutputFile/fromLid', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = {
                ...configBase,
                ...fixture.configOverride,
            };

            const received = tof(cfg).fromLid(fixture.in);

            expect(received).toBe(fixture.out);
        });
    });
});
