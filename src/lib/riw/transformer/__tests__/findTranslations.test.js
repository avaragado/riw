// @flow

import findTranslations from '../findTranslations';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'ignored',
};

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
    config: Object,
    opt: RIWCLIOptDBFind,
    after: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 defaultMessage match',
        before: quadsBase,
        config: {},
        opt: {
            match: {
                defaultMessage: 'two',
            },
        },
        after: [
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
        ],
    },

    {
        name: '02 description match',
        before: quadsBase,
        config: {},
        opt: {
            match: {
                description: 'desc1',
            },
        },
        after: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
            ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
        ],
    },

    {
        name: '03 locale match',
        before: quadsBase,
        config: {},
        opt: {
            match: {
                locale: 'bb-bb',
            },
        },
        after: [
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
        ],
    },

    {
        name: '04 translation match',
        before: quadsBase,
        config: {},
        opt: {
            match: {
                translation: '[cc-cc]1 three',
            },
        },
        after: [
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
        ],
    },
];

describe('lib/riw/transformer/findTranslations', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = { ...cfgBase, ...fixture.config };
            const opt = fixture.opt;

            const received = findTranslations(cfg, opt)(fixture.before);

            expect(received).toEqual(fixture.after);
        });
    });
});
