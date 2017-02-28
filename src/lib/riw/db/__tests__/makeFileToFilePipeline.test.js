// @flow

import fs from 'fs';

import mock from 'mock-fs';

import { makeFileToFilePipeline } from '../makePipeline';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const cfg = {
    ...cfgBase,
    translationsDatabaseFile: 'db.json',
};

const stringify = obj => JSON.stringify(obj, null, 4);

type Fixture = {
    name: string,
    in: RIWDB,
    transformer: RIWDBQuadsTransformer,
    opt?: Object,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {
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
    },
    {
        name: '02',
        in: {
            version: 1,
            data: {},
        },
        transformer: (cfgIn, opt) => quads => quads.concat([
            ['one', 'two', opt ? opt.bar : '', cfgIn.translationsDatabaseFile],
        ]),
        opt: {
            bar: 'bar',
        },
    },
];

describe('lib/riw/db/makeFileToFilePipeline', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                [cfg.translationsDatabaseFile]: stringify(fixture.in),
            });

            makeFileToFilePipeline(fixture.transformer, cfg)(fixture.opt);

            const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

            mock.restore();

            expect(content).toMatchSnapshot();
        });
    });
});
