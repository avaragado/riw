// @flow

import arquadUpdateFromQuadAr from '../arquadUpdateFromQuadAr';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

type Fixture = {
    name: string,
    before: RIWDBQuad[],
    opt: RIWCLIOptDBUpdate,
    after: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 empty translations list',
        before: [],
        opt: {
            translations: [],
        },
        after: [],
    },

    {
        name: '02 adding new message',
        before: [],
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
        name: '03 adding message without description',
        before: [],
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    locale: 'en-re',
                    translation: 'olleh',
                },
            ],
        },
        after: [
            ['hello', '_', 'en-re', 'olleh'],
        ],
    },

    {
        name: '04 updating message, same locale',
        before: [
            ['hello', 'desc1', 'en-re', 'OLD olleh'],
        ],
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
        name: '05 updating message without description, same locale',
        before: [
            ['hello', '_', 'en-re', 'OLD olleh'],
        ],
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    locale: 'en-re',
                    translation: 'NEW olleh',
                },
            ],
        },
        after: [
            ['hello', '_', 'en-re', 'OLD olleh'],
            ['hello', '_', 'en-re', 'NEW olleh'],
        ],
    },

    {
        name: '06 updating message, new locale',
        before: [
            ['hello', 'desc1', 'en-re', 'olleh'],
        ],
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
        name: '07 updating message without description, new locale',
        before: [
            ['hello', '_', 'en-re', 'olleh'],
        ],
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    locale: 'en-UPPER',
                    translation: 'HELLO',
                },
            ],
        },
        after: [
            ['hello', '_', 'en-re', 'olleh'],
            ['hello', '_', 'en-UPPER', 'HELLO'],
        ],
    },

    {
        name: '08 several messages at once',
        before: [
            ['hello', 'desc1', 'en-re', 'olleh'],
        ],
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
            ['goodbye', '_', 'en-re', 'eybdoog'],
            ['foo', 'desc1', 'en-re', 'oof'],
            ['foo', 'desc2', 'en-UPPER', 'FOO'],
        ],
    },
];

describe('lib/riw/db/transform/arquadUpdateFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = arquadUpdateFromQuadAr(cfgBase, fixture.opt)(fixture.before);

            expect(received).toEqual(fixture.after);
        });
    });
});
