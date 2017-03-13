// @flow

import mock from 'mock-fs';

import { configResolve } from '../../../../config';

import ctDistinctForLocales from '../ctDistinctForLocales';

const stringify = obj => JSON.stringify(obj, null, 4);

const cfgBase: RIWConfigSparseWithSource = {
    translationsOutputFile: 'fixtures/dir/[locale].json',
};

type Fixture = {
    name: string,
    cfgOverride: RIWConfigSparse,
    in: { [key: string]: string },
};

const fixtures: Fixture[] = [
    {
        name: '01',
        cfgOverride: {
            outputMode: 'file-per-locale',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {}, // empty dir
    },

    {
        name: '01a',
        cfgOverride: {
            outputMode: 'single-file',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {}, // empty dir
    },

    {
        name: '02',
        cfgOverride: {
            outputMode: 'file-per-locale',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {
            'bb-bb.json': stringify({}),
        },
    },

    {
        name: '02a',
        cfgOverride: {
            outputMode: 'single-file',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {
            'locales.json': stringify({
                'bb-bb': {},
            }),
            'aa-aa.json': stringify({
                'id1': 'string1',
            }),
        },
    },

    {
        name: '03',
        cfgOverride: {
            outputMode: 'file-per-locale',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {
            'aa-aa.json': stringify({
                'id1': 'string1',
                'id2': 'string2',
                'id3': 'string3',
            }),
            'bb-bb.json': stringify({
                'id1': 'string1',
                'id2': 'string2',
            }),
            'cc-cc.json': stringify({
                'id1': 'string1',
            }),
            'dd-dd.json': stringify({
                'id2': 'string2',
                'id3': 'string3',
            }),
        },
    },

    {
        name: '03a',
        cfgOverride: {
            outputMode: 'single-file',
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {
            'locales.json': stringify({
                'aa-aa': {
                    'id1': 'string1',
                    'id2': 'string2',
                    'id3': 'string3',
                },
                'bb-bb': {
                    'id1': 'string1',
                    'id2': 'string2',
                },
                'cc-cc': {
                    'id1': 'string1',
                },
                'dd-dd': {
                    'id2': 'string2',
                    'id3': 'string3',
                },
            }),
        },
    },

    {
        name: '04',
        cfgOverride: {
            outputMode: 'file-per-locale',
            defaultLocale: 'dd-dd',
            targetLocales: ['bb-bb'],
        },
        in: {
            'aa-aa.json': stringify({
                'id1': 'string1',
                'id2': 'string2',
                'id3': 'string3',
            }),
            'bb-bb.json': stringify({
                'id1': 'string1',
                'id2': 'string2',
            }),
            'cc-cc.json': stringify({
                'id1': 'string1',

            }),
            'dd-dd.json': stringify({
                'id2': 'string2',
                'id3': 'string3',
            }),
        },
    },

    {
        name: '04a',
        cfgOverride: {
            outputMode: 'single-file',
            defaultLocale: 'dd-dd',
            targetLocales: ['bb-bb'],
        },
        in: {
            'locales.json': stringify({
                'aa-aa': {
                    'id1': 'string1',
                    'id2': 'string2',
                    'id3': 'string3',
                },
                'bb-bb': {
                    'id1': 'string1',
                    'id2': 'string2',
                },
                'cc-cc': {
                    'id1': 'string1',
                },
                'dd-dd': {
                    'id2': 'string2',
                    'id3': 'string3',
                },
            }),
        },
    },

    {
        name: '04b',
        cfgOverride: {
            outputMode: 'no-file',
            defaultLocale: 'dd-dd',
            targetLocales: ['bb-bb', 'cc-cc'],
        },
        in: {
            'locales.json': stringify({
                'aa-aa': {
                    'id1': 'string1',
                    'id2': 'string2',
                    'id3': 'string3',
                },
                'bb-bb': {
                    'id1': 'string1',
                    'id2': 'string2',
                },
                'cc-cc': {
                    'id1': 'string1',
                },
                'dd-dd': {
                    'id2': 'string2',
                    'id3': 'string3',
                },
            }),
        },
    },
];

describe('lib/riw/project/status/ctDistinctForLocales', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: fixture.in,
                },
            });

            const cfg = configResolve({
                ...cfgBase,
                ...fixture.cfgOverride,
            });

            const received = ctDistinctForLocales(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
