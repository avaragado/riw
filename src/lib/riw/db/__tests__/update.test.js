// @flow

import fs from 'fs';

import mock from 'mock-fs';

import update from '../update';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const cfg = {
    ...cfgBase,
    translationsDatabaseFile: 'db.json',
};

type Fixture = {
    name: string,
    in: RIWDB,
    opt: RIWCLIOptDBUpdate,
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
        name: '03 updating message, same locale',
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
        name: '04 updating message, new locale',
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
        name: '05 several messages at once',
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
                    description: 'desc2',
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
                [cfg.translationsDatabaseFile]: JSON.stringify(fixture.in),
            });

            update(cfg)(fixture.opt);

            const dbOut: RIWDB = JSON.parse(
                fs.readFileSync(cfg.translationsDatabaseFile).toString(),
            );

            mock.restore();

            expect(dbOut).toMatchSnapshot();
        });
    });
});
