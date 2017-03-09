// @flow

import fs from 'fs';

import mock from 'mock-fs';
import outdent from 'outdent';

import translate from '../';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const stringify = obj => JSON.stringify(obj, null, 4);
const parse = frel => JSON.parse(fs.readFileSync(frel).toString());

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

const cfgOverride: RIWConfig = {
    ...cfgBase,
    rootDir: '.',
    defaultLocale: 'en-us',
    targetLocales: ['en-up', 'en-ne'],
    translationsDatabaseFile: 'fixtures/db.json',
    sourceDirs: ['fixtures/dir/**/*.js'],
    translationsOutputFile: 'fixtures/locale/[locale].json',
    outputMode: 'file-per-locale',
    todoFile: 'fixtures/locale/todo.json',
};

type Fixture = {
    name: string,
    in: { [key: string]: string },
    configOverride?: RIWConfigSparse,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {}, // empty
    },

    {
        name: '02',
        in: {
            'a.js': 'export default a => a;',
            'b.js': 'export default b => b + 1;',
        },
    },

    {
        name: '03',
        in: {
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
    },

    {
        name: '04',
        in: {
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
            collateDir: 'fixtures/dir',
            inputMode: 'json',
        },
    },
];

describe('lib/riw/project/translate', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    'dir': fixture.in,
                    'db.json': stringify(db),
                    'locale': {},
                },
            });

            const cfg: RIWConfig = {
                ...cfgOverride,
                ...fixture.configOverride,
            };

            const received = translate(cfg)({});
            const arfrel = fs.readdirSync('fixtures/locale');
            const contents = arfrel.map(frel => parse(`fixtures/locale/${frel}`));

            mock.restore();

            expect(received).toMatchSnapshot();
            expect(arfrel).toMatchSnapshot();
            expect(contents).toMatchSnapshot();
        });
    });
});
