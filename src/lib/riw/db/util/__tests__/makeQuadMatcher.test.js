// @flow

import makeQuadMatcher from '../makeQuadMatcher';

type Fixture = {
    name: string,
    in: RIWDBQuad,
    match: RIWQuadMatcher,
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
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            description: 'one',
        },
        out: false,
    },
    {
        name: '05',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            locale: 'aa-bb',
        },
        out: true,
    },
    {
        name: '06',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            locale: 'aa-bb-cc',
        },
        out: false,
    },
    {
        name: '07',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            translation: '[aa-bb] one',
        },
        out: true,
    },
    {
        name: '08',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            translation: 'aa',
        },
        out: false,
    },
    {
        name: '09',
        in: ['one', 'desc one', 'aa-bb', '[aa-bb] one'],
        match: {
            defaultMessage: 'one',
            locale: 'aa-bb',
        },
        out: true,
    },
    {
        name: '10',
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
