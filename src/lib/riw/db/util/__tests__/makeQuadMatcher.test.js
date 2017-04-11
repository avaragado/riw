// @flow

import type { TranslationQuad } from '../../../../../types';
import type { TranslationMatchSpec } from '../makeQuadMatcher';
import makeQuadMatcher from '../makeQuadMatcher';

type Fixture = {
    name: string,
    in: TranslationQuad,
    match: TranslationMatchSpec,
    out: boolean,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            defaultMessage: 'one',
        },
        out: true,
    },
    {
        name: '02',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            defaultMessage: 'two',
        },
        out: false,
    },
    {
        name: '03',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            description: 'desc one',
        },
        out: true,
    },
    {
        name: '04',
        in: ['one', '{"a":1,"label":"desc one"}', 'aa-bb', '[aa-bb] one'],
        match: {
            description: {
                label: 'desc one',
                a: 1,
            },
        },
        out: true,
    },
    {
        name: '05',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            description: 'one',
        },
        out: false,
    },
    {
        name: '06',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            description: {
                label: 'desc one',
            },
        },
        out: false,
    },
    {
        name: '07',
        in: ['one', '{"a":1,"label":"desc one"}', 'aa-bb', '[aa-bb] one'],
        match: {
            description: {
                label: 'desc one',
            },
        },
        out: false,
    },
    {
        name: '08',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            locale: 'aa-bb',
        },
        out: true,
    },
    {
        name: '09',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            locale: 'aa-bb-cc',
        },
        out: false,
    },
    {
        name: '10',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            translation: '[aa-bb] one',
        },
        out: true,
    },
    {
        name: '11',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            translation: 'aa',
        },
        out: false,
    },
    {
        name: '12',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            defaultMessage: 'one',
            locale: 'aa-bb',
        },
        out: true,
    },
    {
        name: '13',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            defaultMessage: 'two',
            locale: 'aa-bb',
        },
        out: false,
    },
];

describe('lib/riw/db/transform/util/makeQuadMatcher', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = makeQuadMatcher(fixture.match)(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
