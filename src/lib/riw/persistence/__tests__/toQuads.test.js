// @flow

import toQuads from '../toQuads';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'ignored',
};

type Fixture = {
    name: string,
    in: RIWDB,
    config: Object,
    out: RIWDBQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 empty db',
        in: {
            version: 1,
            data: {},
        },
        config: {},
        out: [],
    },

    {
        name: '02 lots of entries',
        in: {
            version: 1,
            data: {
                'hello': {
                    'desc1': {
                        'en-re': 'olleh',
                        'en-UP': 'HELLO',
                    },
                    'desc2': {
                        'fr-fr': 'bonjour',
                    },
                },
                'goodbye': {
                    'desc1': {
                        'en-re': 'eybdoog',
                        'en-UP': 'GOODBYE',
                    },
                },
            },
        },
        config: {},
        out: [
            ['hello', 'desc1', 'en-re', 'olleh'],
            ['hello', 'desc1', 'en-UP', 'HELLO'],
            ['hello', 'desc2', 'fr-fr', 'bonjour'],
            ['goodbye', 'desc1', 'en-re', 'eybdoog'],
            ['goodbye', 'desc1', 'en-UP', 'GOODBYE'],
        ],
    },
];

describe('lib/riw/persistence/toQuads', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = { ...cfgBase, ...fixture.config };

            const received = toQuads(cfg)(fixture.in);

            expect(received).toEqual(fixture.out);
        });
    });
});
