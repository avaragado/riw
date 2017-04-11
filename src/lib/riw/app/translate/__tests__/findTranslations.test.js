// @flow

import type { MessageDescriptorWithFile } from '../../../../../types';
import type { ConfigSparseWithSource } from '../../../../config';
import { configResolve } from '../../../../config';
import type { TranslationsDB } from '../../../db';

import findTranslations from '../findTranslations';

const notify = () => x => x;

type Fixture = {
    name: string,
    db: TranslationsDB,
    armd: MessageDescriptorWithFile[],
    configOverride: ConfigSparseWithSource,
};

const fixtures: Fixture[] = [
    {
        name: '01 nothing gets nothing',
        db: {
            version: 1,
            data: {
            },
        },
        armd: [],
        configOverride: {
            defaultLocale: 'en-aa',
        },
    },

    {
        name: '02 no db: md misses',
        db: {
            version: 1,
            data: {
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '03 db missing target locale: md ignored',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
        },
    },

    {
        name: '04 db has missing defaultMessage: md misses',
        db: {
            version: 1,
            data: {
                'NOT': {
                    'a desc': {
                        'en-up': 'A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: 'a desc',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '05 db has missing defined string description: md misses',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'A',
                    },
                    'NOT': {
                        'en-up': 'A NOT',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: 'a desc',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '06 db has missing defined object description: md misses',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'A',
                    },
                    'NOT': {
                        'en-up': 'A NOT',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: {
                    blah: 'foo',
                },
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '07 db has missing locale: md misses',
        db: {
            version: 1,
            data: {
                'a': {
                    'a desc': {
                        'en-zz': 'zz A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: 'a desc',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '08 match works - string description',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'NOT A',
                    },
                    'a desc': {
                        'en-up': 'A',
                    },
                    'other desc': {
                        'en-up': 'NOT A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: 'a desc',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '09 match works - object description',
        db: {
            version: 1,
            data: {
                'a': {
                    '{"blah":"foo"}': {
                        'en-up': 'A',
                    },
                    'blah': {
                        'en-up': 'NOT A',
                    },
                    'foo': {
                        'en-up': 'NOT A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: {
                    blah: 'foo',
                },
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '10 match works - no description',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'A',
                    },
                    'a desc': {
                        'en-up': 'NOT A',
                    },
                    'other desc': {
                        'en-up': 'NOT A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '11 match works - undefined description',
        db: {
            version: 1,
            data: {
                'a': {
                    '_': {
                        'en-up': 'A',
                    },
                    'a desc': {
                        'en-up': 'NOT A',
                    },
                    'other desc': {
                        'en-up': 'NOT A',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a',
                description: undefined,
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
    },

    {
        name: '12 simple multi',
        db: {
            version: 1,
            data: {
                'a1': {
                    '_': {
                        'en-up': 'A1',
                        'en-ne': '1A',
                    },
                    'a1 desc': {
                        'en-up': 'A1 DESC',
                    },
                },
                'b1': {
                    '_': {
                        'en-up': 'B1',
                        'en-ne': '1B',
                    },
                },
                'c1': {
                    '_': {
                        'en-up': 'C1',
                        'en-zz': 'zz C1',
                    },
                    'NOT': {
                        'en-up': 'C1 NOT',
                    },
                },
            },
        },
        armd: [
            {
                id: 'md1',
                defaultMessage: 'a1',
                file: '/a.js',
            },
            {
                id: 'md2',
                defaultMessage: 'c1',
                file: '/c.js',
            },
            {
                id: 'md3',
                defaultMessage: 'a1',
                description: 'a1 desc',
                file: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up', 'en-ne'],
        },
    },
];

describe('lib/riw/app/translate/findTranslations', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = configResolve(fixture.configOverride);

            const received = findTranslations(cfg, notify, fixture.db)(fixture.armd);

            expect(received).toMatchSnapshot();
        });
    });
});
