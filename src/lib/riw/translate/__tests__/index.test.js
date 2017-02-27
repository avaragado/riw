// @flow

import path from 'path';
import fs from 'fs';

import mock from 'mock-fs';
import outdent from 'outdent';

import translate from '../';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const absify = (name, frel) => path.resolve('fixtures', name, frel);
const stringify = obj => JSON.stringify(obj, null, 4);

const db: RIWDB = {
    version: 1,
    data: {
        'a.1!': {
            '_': {
                'en-up': 'A.1!',
                'en-ne': '!1.a',
            },
        },
        'b.1!': {
            '_': {
                'en-ne': '!1.b',
            },
        },
        'b.2!': {
            'b.2 desc': {
                'en-up': 'B.2!',
            },
        },
    },
};

const cfgOverride = {
    ...cfgBase,
    rootDir: '.',
    defaultLocale: 'en-us',
    targetLocales: ['en-up', 'en-ne'],
    translationsDatabaseFile: 'fixtures/db.json',
    translationsOutputFile: 'fixtures/locale/[locale].json',
    outputMode: 'file-per-locale',
    todoFile: 'fixtures/locale/todo.json',
};

type Fixture = {
    name: string,
    dir: { [key: string]: string },
    configOverride?: Object,
    out: RIWCLIProjectTranslateResult,
    fs: Object,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        dir: {}, // empty
        out: {
            armd: [],
            dups: [],
            translation: {
                locale: {},
                armdu: [],
            },
        },
        fs: {
            'en-us.json': {},
            'en-up.json': {},
            'en-ne.json': {},
            'todo.json': [],
        },
    },

    {
        name: '02',
        dir: {
            'a.js': 'export default a => a;',
            'b.js': 'export default b => b + 1;',
        },
        out: {
            armd: [],
            dups: [],
            translation: {
                locale: {},
                armdu: [],
            },
        },
        fs: {
            'en-us.json': {},
            'en-up.json': {},
            'en-ne.json': {},
            'todo.json': [],
        },
    },

    {
        name: '03',
        dir: {
            'a.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1: {
                        id: 'a.1',
                        defaultMessage: 'a.1!',
                    },
                });
            `,
            'aa.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1again: {
                        id: 'a.1',
                        defaultMessage: 'a.1 again!',
                    },
                });
            `,
            'b.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b1: {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                    },
                    b2: {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                    },
                });
            `,
            'bb.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b2again: {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                    },
                });
            `,
            'c.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    c1: {
                        id: 'c.1',
                        defaultMessage: 'c.1!',
                    },
                });
            `,
        },
        out: {
            armd: [
                {
                    id: 'a.1',
                    description: undefined,
                    defaultMessage: 'a.1!',
                    fabs: absify('03', 'a.js'),
                },
                {
                    id: 'a.1',
                    description: undefined,
                    defaultMessage: 'a.1 again!',
                    fabs: absify('03', 'aa.js'),
                },
                {
                    id: 'b.1',
                    description: undefined,
                    defaultMessage: 'b.1!',
                    fabs: absify('03', 'b.js'),
                },
                {
                    id: 'b.2',
                    description: 'b.2 desc',
                    defaultMessage: 'b.2!',
                    fabs: absify('03', 'b.js'),
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('03', 'bb.js'),
                },
                {
                    id: 'c.1',
                    description: undefined,
                    defaultMessage: 'c.1!',
                    fabs: absify('03', 'c.js'),
                },
            ],
            dups: [
                {
                    id: 'a.1',
                    arfabs: ['a.js', 'aa.js'].map(frel => absify('03', frel)),
                },
                {
                    id: 'b.2',
                    arfabs: ['b.js', 'bb.js'].map(frel => absify('03', frel)),
                },
            ],
            translation: {
                locale: {
                    'en-us': {
                        'a.1': 'a.1 again!',
                        'b.1': 'b.1!',
                        'b.2': 'b.2 again!',
                        'c.1': 'c.1!',
                    },
                    'en-up': {
                        'a.1': 'A.1!',
                        'b.2': 'B.2!',
                    },
                    'en-ne': {
                        'a.1': '!1.a',
                        'b.1': '!1.b',
                    },
                },
                armdu: [
                    {
                        id: 'a.1',
                        description: undefined,
                        defaultMessage: 'a.1 again!',
                        fabs: absify('03', 'aa.js'),
                        locale: 'en-up',
                    },
                    {
                        id: 'a.1',
                        description: undefined,
                        defaultMessage: 'a.1 again!',
                        fabs: absify('03', 'aa.js'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'b.1',
                        description: undefined,
                        defaultMessage: 'b.1!',
                        fabs: absify('03', 'b.js'),
                        locale: 'en-up',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                        fabs: absify('03', 'b.js'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                        fabs: absify('03', 'bb.js'),
                        locale: 'en-up',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                        fabs: absify('03', 'bb.js'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'c.1',
                        description: undefined,
                        defaultMessage: 'c.1!',
                        fabs: absify('03', 'c.js'),
                        locale: 'en-up',
                    },
                    {
                        id: 'c.1',
                        description: undefined,
                        defaultMessage: 'c.1!',
                        fabs: absify('03', 'c.js'),
                        locale: 'en-ne',
                    },
                ],
            },
        },
        fs: {
            'en-us.json': {
                'a.1': 'a.1 again!',
                'b.1': 'b.1!',
                'b.2': 'b.2 again!',
                'c.1': 'c.1!',
            },
            'en-up.json': {
                'a.1': 'A.1!',
                'b.2': 'B.2!',
            },
            'en-ne.json': {
                'a.1': '!1.a',
                'b.1': '!1.b',
            },
            'todo.json': [
                {
                    id: 'a.1',
                    description: undefined,
                    defaultMessage: 'a.1 again!',
                    fabs: absify('03', 'aa.js'),
                    locale: 'en-up',
                },
                {
                    id: 'a.1',
                    description: undefined,
                    defaultMessage: 'a.1 again!',
                    fabs: absify('03', 'aa.js'),
                    locale: 'en-ne',
                },
                {
                    id: 'b.1',
                    description: undefined,
                    defaultMessage: 'b.1!',
                    fabs: absify('03', 'b.js'),
                    locale: 'en-up',
                },
                {
                    id: 'b.2',
                    description: 'b.2 desc',
                    defaultMessage: 'b.2!',
                    fabs: absify('03', 'b.js'),
                    locale: 'en-ne',
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('03', 'bb.js'),
                    locale: 'en-up',
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('03', 'bb.js'),
                    locale: 'en-ne',
                },
                {
                    id: 'c.1',
                    description: undefined,
                    defaultMessage: 'c.1!',
                    fabs: absify('03', 'c.js'),
                    locale: 'en-up',
                },
                {
                    id: 'c.1',
                    description: undefined,
                    defaultMessage: 'c.1!',
                    fabs: absify('03', 'c.js'),
                    locale: 'en-ne',
                },
            ],
        },
    },

    {
        name: '04',
        dir: {
            'a.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1!"
                    }
                ]
            `,
            'aa.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1 again!"
                    }
                ]
            `,
            'b.json': outdent`
                [
                    {
                        "id": "b.1",
                        "defaultMessage": "b.1!"
                    },
                    {
                        "id": "b.2",
                        "description": "b.2 desc",
                        "defaultMessage": "b.2!"
                    }
                ]
            `,
            'bb.json': outdent`
                [
                    {
                        "id": "b.2",
                        "description": "b.2 again desc",
                        "defaultMessage": "b.2 again!"
                    }
                ]
            `,
            'c.json': outdent`
                [
                    {
                        "id": "c.1",
                        "defaultMessage": "c.1!"
                    }
                ]
            `,
        },
        configOverride: {
            collateDir: 'fixtures/04',
            inputMode: 'json',
        },
        out: {
            armd: [
                {
                    id: 'a.1',
                    defaultMessage: 'a.1!',
                    fabs: absify('04', 'a.json'),
                },
                {
                    id: 'a.1',
                    defaultMessage: 'a.1 again!',
                    fabs: absify('04', 'aa.json'),
                },
                {
                    id: 'b.1',
                    defaultMessage: 'b.1!',
                    fabs: absify('04', 'b.json'),
                },
                {
                    id: 'b.2',
                    description: 'b.2 desc',
                    defaultMessage: 'b.2!',
                    fabs: absify('04', 'b.json'),
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('04', 'bb.json'),
                },
                {
                    id: 'c.1',
                    defaultMessage: 'c.1!',
                    fabs: absify('04', 'c.json'),
                },
            ],
            dups: [
                {
                    id: 'a.1',
                    arfabs: ['a.json', 'aa.json'].map(frel => absify('04', frel)),
                },
                {
                    id: 'b.2',
                    arfabs: ['b.json', 'bb.json'].map(frel => absify('04', frel)),
                },
            ],
            translation: {
                locale: {
                    'en-us': {
                        'a.1': 'a.1 again!',
                        'b.1': 'b.1!',
                        'b.2': 'b.2 again!',
                        'c.1': 'c.1!',
                    },
                    'en-up': {
                        'a.1': 'A.1!',
                        'b.2': 'B.2!',
                    },
                    'en-ne': {
                        'a.1': '!1.a',
                        'b.1': '!1.b',
                    },
                },
                armdu: [
                    {
                        id: 'a.1',
                        defaultMessage: 'a.1 again!',
                        fabs: absify('04', 'aa.json'),
                        locale: 'en-up',
                    },
                    {
                        id: 'a.1',
                        defaultMessage: 'a.1 again!',
                        fabs: absify('04', 'aa.json'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                        fabs: absify('04', 'b.json'),
                        locale: 'en-up',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                        fabs: absify('04', 'b.json'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                        fabs: absify('04', 'bb.json'),
                        locale: 'en-up',
                    },
                    {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                        fabs: absify('04', 'bb.json'),
                        locale: 'en-ne',
                    },
                    {
                        id: 'c.1',
                        defaultMessage: 'c.1!',
                        fabs: absify('04', 'c.json'),
                        locale: 'en-up',
                    },
                    {
                        id: 'c.1',
                        defaultMessage: 'c.1!',
                        fabs: absify('04', 'c.json'),
                        locale: 'en-ne',
                    },
                ],
            },
        },
        fs: {
            'en-us.json': {
                'a.1': 'a.1 again!',
                'b.1': 'b.1!',
                'b.2': 'b.2 again!',
                'c.1': 'c.1!',
            },
            'en-up.json': {
                'a.1': 'A.1!',
                'b.2': 'B.2!',
            },
            'en-ne.json': {
                'a.1': '!1.a',
                'b.1': '!1.b',
            },
            'todo.json': [
                {
                    id: 'a.1',
                    defaultMessage: 'a.1 again!',
                    fabs: absify('04', 'aa.json'),
                    locale: 'en-up',
                },
                {
                    id: 'a.1',
                    defaultMessage: 'a.1 again!',
                    fabs: absify('04', 'aa.json'),
                    locale: 'en-ne',
                },
                {
                    id: 'b.1',
                    defaultMessage: 'b.1!',
                    fabs: absify('04', 'b.json'),
                    locale: 'en-up',
                },
                {
                    id: 'b.2',
                    description: 'b.2 desc',
                    defaultMessage: 'b.2!',
                    fabs: absify('04', 'b.json'),
                    locale: 'en-ne',
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('04', 'bb.json'),
                    locale: 'en-up',
                },
                {
                    id: 'b.2',
                    description: 'b.2 again desc',
                    defaultMessage: 'b.2 again!',
                    fabs: absify('04', 'bb.json'),
                    locale: 'en-ne',
                },
                {
                    id: 'c.1',
                    defaultMessage: 'c.1!',
                    fabs: absify('04', 'c.json'),
                    locale: 'en-up',
                },
                {
                    id: 'c.1',
                    defaultMessage: 'c.1!',
                    fabs: absify('04', 'c.json'),
                    locale: 'en-ne',
                },
            ],
        },
    },
];

describe('lib/riw/translate', () => {
    afterEach(() => {
        mock.restore();
    });

    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    [fixture.name]: fixture.dir,
                    'db.json': stringify(db),
                    'locale': {},
                },
            });

            const cfg = {
                ...cfgOverride,
                sourceDirs: [`fixtures/${fixture.name}/**/*.js`],
                ...fixture.configOverride,
            };

            const received = translate(cfg)({});

            expect(received).toEqual(fixture.out);

            const arfrel = fs.readdirSync('fixtures/locale');

            expect(arfrel).toEqual(Object.keys(fixture.fs).sort());

            arfrel.forEach((frel) => {
                const content = JSON.parse(fs.readFileSync(`fixtures/locale/${frel}`).toString());

                expect(content).toEqual(fixture.fs[frel]);
            });
        });
    });
});
