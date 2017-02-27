// @flow

import findTranslations from '../findTranslations';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const notify = () => x => x;

type Fixture = {
    name: string,
    db: RIWDB,
    armd: RIWMessageDescriptor[],
    configOverride: Object,
    out: {
        locale: {
            [key: LocaleId]: {
                [key: RIWMessageId]: RIWDBTranslatedMessage,
            },
        },
        armdu: RIWMessageDescriptorUntranslated[],
    },
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
        out: {
            locale: {},
            armdu: [],
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
            },
            armdu: [
                {
                    id: 'md1',
                    defaultMessage: 'a',
                    fabs: '/a.js',
                    locale: 'en-up',
                },
            ],
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
            },
            armdu: [],
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
            },
            armdu: [
                {
                    id: 'md1',
                    defaultMessage: 'a',
                    description: 'a desc',
                    fabs: '/a.js',
                    locale: 'en-up',
                },
            ],
        },
    },

    {
        name: '05 db has missing defined description: md misses',
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
            },
            armdu: [
                {
                    id: 'md1',
                    defaultMessage: 'a',
                    description: 'a desc',
                    fabs: '/a.js',
                    locale: 'en-up',
                },
            ],
        },
    },

    {
        name: '06 db has missing locale: md misses',
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
            },
            armdu: [
                {
                    id: 'md1',
                    defaultMessage: 'a',
                    description: 'a desc',
                    fabs: '/a.js',
                    locale: 'en-up',
                },
            ],
        },
    },

    {
        name: '07 simple match works',
        db: {
            version: 1,
            data: {
                'a': {
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
                'en-up': {
                    'md1': 'A',
                },
            },
            armdu: [],
        },
    },

    {
        name: '08 no description with default works',
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
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a',
                },
                'en-up': {
                    'md1': 'A',
                },
            },
            armdu: [],
        },
    },

    {
        name: '09 simple multi',
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
                fabs: '/a.js',
            },
            {
                id: 'md2',
                defaultMessage: 'c1',
                fabs: '/c.js',
            },
            {
                id: 'md3',
                defaultMessage: 'a1',
                description: 'a1 desc',
                fabs: '/a.js',
            },
        ],
        configOverride: {
            defaultLocale: 'en-aa',
            targetLocales: ['en-up', 'en-ne'],
        },
        out: {
            locale: {
                'en-aa': {
                    'md1': 'a1',
                    'md2': 'c1',
                    'md3': 'a1',
                },
                'en-up': {
                    'md1': 'A1',
                    'md2': 'C1',
                    'md3': 'A1 DESC',
                },
                'en-ne': {
                    'md1': '1A',
                },
            },
            armdu: [
                {
                    id: 'md2',
                    defaultMessage: 'c1',
                    fabs: '/c.js',
                    locale: 'en-ne',
                },
                {
                    id: 'md3',
                    defaultMessage: 'a1',
                    description: 'a1 desc',
                    fabs: '/a.js',
                    locale: 'en-ne',
                },
            ],
        },
    },
];

describe('lib/riw/translate/findTranslations', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = {
                ...cfgBase,
                ...fixture.configOverride,
            };

            const received = findTranslations(cfg, notify, fixture.db)(fixture.armd);

            expect(received).toEqual(fixture.out);
        });
    });
});
