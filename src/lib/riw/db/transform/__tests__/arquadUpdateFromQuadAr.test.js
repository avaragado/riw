// @flow

import stringify from 'json-stable-stringify';

import type { TranslationQuad } from '../../../../../types';
import type { DBUpdateSpec } from '../../update';
import arquadUpdateFromQuadAr from '../arquadUpdateFromQuadAr';

type Fixture = {
    name: string,
    before: TranslationQuad[],
    opt: DBUpdateSpec,
    after: TranslationQuad[],
};

const descObj = {
    one: {
        z: 123,
        a: 'abc',
        nested: {
            a: 1,
            c: 2,
            b: 3,
        },
    },
    two: {
        text: 'desc2',
        random: 123,
    },
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
        name: '02 adding new message with string description',
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
        name: '02 adding new message with object description',
        before: [],
        opt: {
            translations: [
                {
                    defaultMessage: 'hello',
                    description: descObj.one,
                    locale: 'en-re',
                    translation: 'olleh',
                },
            ],
        },
        after: [
            ['hello', stringify(descObj.one), 'en-re', 'olleh'],
        ],
    },

    {
        name: '04 adding message without description',
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
        name: '05 updating message, same locale',
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
        name: '06 updating message without description, same locale',
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
        name: '07 updating message, new locale',
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
        name: '08 updating message without description, new locale',
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
        name: '09 several messages at once',
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
                    description: descObj.two,
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
            ['foo', stringify(descObj.two), 'en-UPPER', 'FOO'],
        ],
    },
];

describe('lib/riw/db/transform/arquadUpdateFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = arquadUpdateFromQuadAr(fixture.opt)(fixture.before);

            expect(received).toEqual(fixture.after);
        });
    });
});
