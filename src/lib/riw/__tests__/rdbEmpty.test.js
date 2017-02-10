// @flow

import rdbEmptyFromConfig from '../rdbEmpty';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    translationsDatabaseFile: 'ignored',
};

const arFixture = [
    {
        name: 'no target locales',
        config: {
            ...cfgBase,
        },
        expect: {
            version: 1,
            data: {},
        },
    },

    {
        name: 'some target locales',
        config: {
            ...cfgBase,
            targetLocales: ['bb-cc', 'dd-ee'],
        },
        expect: {
            version: 1,
            data: {},
        },
    },
];

describe('lib/riw/rdbEmpty', () => {
    arFixture.forEach(fixture => it(fixture.name, () => {
        const rdbEmpty = rdbEmptyFromConfig(fixture.config);

        expect(rdbEmpty()).toEqual(fixture.expect);
    }));
});
