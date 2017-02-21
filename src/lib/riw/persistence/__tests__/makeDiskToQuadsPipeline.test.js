// @flow

import mock from 'mock-fs';

import { makeDiskToQuadsPipeline } from '../makePipeline';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const stringify = obj => JSON.stringify(obj, null, 4);

type Fixture = {
    name: string,
    before: RIWDB,
    transformer: RIWDBQuadsTransformer,
    opt?: Object,
    after: RIWDBQuad[],
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
        after: [
            ['one', 'two', 'three', 'four'],
            ['one', 'two2', 'three', 'four'],
        ],
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
        after: [
            ['one', 'two', 'bar', '02'],
        ],
    },
];

describe('lib/riw/persistence/makeDiskToQuadsPipeline', () => {
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

            const quads = makeDiskToQuadsPipeline(fixture.transformer, cfg)(fixture.opt);

            expect(quads).toEqual(fixture.after);
        });
    });
});
