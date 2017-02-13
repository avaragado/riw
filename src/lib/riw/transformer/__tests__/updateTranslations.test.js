// @flow

import updateTranslations from '../updateTranslations';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'ignored',
};

type Fixture = {
    name: string,
    before: RIWDB,
    config: Object,
    opt: RIWCLIUpdateTranslationsOpt,
    after: RIWDB,
};

const fixtures: Fixture[] = [
    {
        name: '01 empty translations list',
        before: {
            version: 1,
            data: {},
        },
        config: {},
        opt: {
            translations: [],
        },
        after: {
            version: 1,
            data: {},
        },
    },

    {
        name: '02 adding new message',
        before: {
            version: 1,
            data: {},
        },
        config: {},
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
        after: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                    },
                },
            },
        },
    },

    {
        name: '03 updating message, same locale',
        before: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'OLD olleh',
                    },
                },
            },
        },
        config: {},
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
        after: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'NEW olleh',
                    },
                },
            },
        },
    },

    {
        name: '04 updating message, new locale',
        before: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                    },
                },
            },
        },
        config: {},
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
        after: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                        'en-UPPER': 'HELLO',
                    },
                },
            },
        },
    },

    {
        name: '05 several messages at once',
        before: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                    },
                },
            },
        },
        config: {},
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
        after: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                        'en-UPPER': 'HELLO',
                    },
                },
                'goodbye': {
                    'desc1': {
                        'en-re': 'eybdoog',
                    },
                },
                'foo': {
                    'desc1': {
                        'en-re': 'oof',
                    },
                    'desc2': {
                        'en-UPPER': 'FOO',
                    },
                },
            },
        },
    },
];

describe('lib/riw/transformer/updateTranslations', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = { ...cfgBase, ...fixture.config };
            const opt = fixture.opt;

            const received = updateTranslations(cfg, opt)(fixture.before);

            expect(received).toEqual(fixture.after);
        });
    });
});
