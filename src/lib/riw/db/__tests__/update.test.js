// @flow

import fs from 'fs';

import mock from 'mock-fs';

import type { ConfigSparseWithSource } from '../../../config';
import { configResolve } from '../../../config';

import type { TranslationsDB } from '../';
import type { DBUpdateSpec } from '../update';
import update from '../update';

const frelDB = 'db.json';

const cfg: ConfigSparseWithSource = {
    translationsDatabaseFile: frelDB,
};

type Fixture = {
    name: string,
    in: TranslationsDB,
    opt: DBUpdateSpec,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db, no messages to update',
        in: {
            version: 1,
            data: {},
        },
        opt: {
            translations: [],
        },
    },

    {
        name: '02 adding new message',
        in: {
            version: 1,
            data: {},
        },
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: 'desc1',
                    locale: 'en-re',
                    translation: 'olleh',
                },
            ],
        },
    },

    {
        name: '03 adding new message with object description',
        in: {
            version: 1,
            data: {},
        },
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: {
                        label: 'desc1',
                        foo: 123,
                    },
                    locale: 'en-re',
                    translation: 'olleh',
                },
            ],
        },
    },

    {
        name: '04 updating message, same locale',
        in: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'OLD olleh',
                    },
                },
            },
        },
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: 'desc1',
                    locale: 'en-re',
                    translation: 'NEW olleh',
                },
            ],
        },
    },

    {
        name: '05 updating message, new locale',
        in: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                    },
                },
            },
        },
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: 'desc1',
                    locale: 'en-UPPER',
                    translation: 'HELLO',
                },
            ],
        },
    },

    {
        name: '06 several messages at once',
        in: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                    },
                },
            },
        },
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: 'desc1',
                    locale: 'en-UPPER',
                    translation: 'HELLO',
                },
                {
                    defaultMessage: 'goodbye',
                    description: 'desc1',
                    locale: 'en-re',
                    translation: 'eybdoog',
                },
                {
                    defaultMessage: 'foo',
                    description: 'desc1',
                    locale: 'en-re',
                    translation: 'oof',
                },
                {
                    defaultMessage: 'foo',
                    description: {
                        z: 1,
                        a: 2,
                        ddd: 'desc2',
                    },
                    locale: 'en-UPPER',
                    translation: 'FOO',
                },
            ],
        },
    },
];

describe('lib/riw/db/update', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                [frelDB]: JSON.stringify(fixture.in),
            });

            update(configResolve(cfg))(fixture.opt);

            const dbOut: TranslationsDB = JSON.parse(fs.readFileSync(frelDB).toString());

            mock.restore();

            expect(dbOut).toMatchSnapshot();
        });
    });
});
