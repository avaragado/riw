// @flow

import fs from 'fs';

import mock from 'mock-fs';

import { makeDiskRWPipeline } from '../makePipeline';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'overwritten',
};

const stringify = obj => JSON.stringify(obj, null, 4);

type Fixture = {
    name: string,
    before: RIWDB,
    transformer: RIWDBQuadsTransformer,
    opt?: Object,
    after: RIWDB,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        before: {
            version: 1,
            data: {
                'one': {
                    'two': {
                        'three': 'four',
                    },
                },
            },
        },
        transformer: () => quads => quads.concat([['one', 'two2', 'three', 'four']]),
        after: {
            version: 1,
            data: {
                'one': {
                    'two': {
                        'three': 'four',
                    },
                    'two2': {
                        'three': 'four',
                    },
                },
            },
        },
    },
    {
        name: '02',
        before: {
            version: 1,
            data: {},
        },
        transformer: (cfg, opt) => quads => quads.concat([
            ['one', 'two', opt ? opt.bar : '', cfg.translationsDatabaseFile],
        ]),
        opt: {
            bar: 'bar',
        },
        after: {
            version: 1,
            data: {
                'one': {
                    'two': {
                        'bar': '02',
                    },
                },
            },
        },
    },
];

describe('lib/riw/persistence/makeDiskRWPipeline', () => {
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

            makeDiskRWPipeline(fixture.transformer, cfg)(fixture.opt);

            const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

            expect(content).toEqual(stringify(fixture.after));
        });
    });
});
