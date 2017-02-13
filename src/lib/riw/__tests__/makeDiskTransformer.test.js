// @flow

import fs from 'fs';

import mock from 'mock-fs';

import makeDiskTransformer from '../makeDiskTransformer';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'overwritten',
};

const stringify = obj => JSON.stringify(obj, null, 4);

type Fixture = {
    name: string,
    before: RIWDB,
    transformer: RIWDBTransformer,
    opt?: Object,
    after: RIWDB,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        before: {
            version: 1,
            data: {},
        },
        transformer: () => rdb => ({
            ...rdb,
            foo: true,
        }),
        after: {
            version: 1,
            data: {},
            foo: true,
        },
    },
    {
        name: '02',
        before: {
            version: 1,
            data: {},
        },
        transformer: (cfg, opt) => rdb => ({
            ...rdb,
            bar: opt ? opt.bar : 0,
            baz: cfg ? cfg.translationsDatabaseFile : '',
        }),
        opt: {
            bar: 123,
        },
        after: {
            version: 1,
            data: {},
            bar: 123,
            baz: '02',
        },
    },
];

describe('lib/riw/transformRDB', () => {
    afterEach(() => {
        mock.restore();
    });

    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                [fixture.name]: stringify(fixture.before),
            });

            const cfg = {
                ...cfgBase,
                translationsDatabaseFile: fixture.name,
            };

            makeDiskTransformer(fixture.transformer, cfg)(fixture.opt);

            const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

            expect(content).toEqual(stringify(fixture.after));
        });
    });
});
