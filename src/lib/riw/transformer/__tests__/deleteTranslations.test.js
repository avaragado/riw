// @flow

import deleteTranslations from '../deleteTranslations';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const quadsBase = [
    ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
    ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
    ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
    ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
    ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
    ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
    ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
    ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
];

type Fixture = {
    name: string,
    before: RIWDBQuad[],
    opt: RIWCLIOptDBFind,
    after: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 defaultMessage match',
        before: quadsBase,
        opt: {
            match: {
                defaultMessage: 'two',
            },
        },
        after: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
            ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
        ],
    },

    {
        name: '02 description match',
        before: quadsBase,
        opt: {
            match: {
                description: 'desc1',
            },
        },
        after: [
            ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
        ],
    },

    {
        name: '03 locale match',
        before: quadsBase,
        opt: {
            match: {
                locale: 'bb-bb',
            },
        },
        after: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
            ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
        ],
    },

    {
        name: '04 translation match',
        before: quadsBase,
        opt: {
            match: {
                translation: '[cc-cc]1 three',
            },
        },
        after: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
            ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
        ],
    },
];

describe('lib/riw/transformer/deleteTranslations', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const opt = fixture.opt;

            const received = deleteTranslations(cfgBase, opt)(fixture.before);

            expect(received).toEqual(fixture.after);
        });
    });
});
