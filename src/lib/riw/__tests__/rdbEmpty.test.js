// @flow

import rdbEmptyFromConfig from '../rdbEmpty';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'ignored',
};

type Fixture = {|
    name: string,
    config: Object,
    after: RIWDB,
|};

const fixtures: Fixture[] = [
    {
        name: 'no target locales',
        config: {},
        after: {
            version: 1,
            data: {},
        },
    },

    {
        name: 'some target locales',
        config: {
            targetLocales: ['bb-cc', 'dd-ee'],
        },
        after: {
            version: 1,
            data: {},
        },
    },
];

describe('lib/riw/rdbEmpty', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = { ...cfgBase, ...fixture.config };

            const received = rdbEmptyFromConfig(cfg)();

            expect(received).toEqual(fixture.after);
        });
    });
});

