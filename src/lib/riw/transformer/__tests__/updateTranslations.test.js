// @flow

import updateTranslations from '../updateTranslations';
import cfgBase from '../../__tests__/helpers/dummyConfig';

type Fixture = {
    name: string,
    before: RIWDBQuad[],
    config: Object,
    opt: RIWCLIOptDBUpdate,
    after: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 empty translations list',
        before: [],
        config: {},
        opt: {
            translations: [],
        },
        after: [],
    },

    {
        name: '02 adding new message',
        before: [],
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
        after: [
            ['hello', 'desc1', 'en-re', 'olleh'],
        ],
    },

    {
        name: '03 updating message, same locale',
        before: [
            ['hello', 'desc1', 'en-re', 'OLD olleh'],
        ],
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
        after: [
            ['hello', 'desc1', 'en-re', 'OLD olleh'],
            ['hello', 'desc1', 'en-re', 'NEW olleh'],
        ],
    },

    {
        name: '04 updating message, new locale',
        before: [
            ['hello', 'desc1', 'en-re', 'olleh'],
        ],
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
        after: [
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UPPER', 'HELLO'],
        ],
    },

    {
        name: '05 several messages at once',
        before: [
            ['hello', 'desc1', 'en-re', 'olleh'],
        ],
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
        after: [
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UPPER', 'HELLO'],
            ['goodbye', 'desc1', 'en-re', 'eybdoog'],
            ['foo', 'desc1', 'en-re', 'oof'],
            ['foo', 'desc2', 'en-UPPER', 'FOO'],
        ],
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
